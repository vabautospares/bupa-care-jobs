/**
 * Care Careers Google Sheets integration.
 * Architecture: Next.js API → Google Apps Script Web App → Google Sheets.
 */

const CAREERS_SPREADSHEET_ID =
  '1cq-dm7aMpUD54lQK5dZcnd3VdE7KqUd9d6Hu_j4VY1o';

const OPPORTUNITIES_SHEET_NAME = 'Opportunities';
const APPLICATIONS_SHEET_NAME = 'Applications';

const OPPORTUNITIES_HEADERS = [
  'id',
  'title',
  'location',
  'description',
  'category',
  'employmentType',
  'availability',
  'active',
];

/**
 * Canonical Applications column order. doPost writes in this order, and
 * repairApplicationsSheet() checks the sheet headers against it.
 */
const APPLICATION_HEADERS = [
  'application_id',
  'submitted_at',
  'full_name',
  'email',
  'phone',
  'whatsapp',
  'country',
  'uk_location',
  'role',
  'preferred_location',
  'work_type',
  'employment_preference',
  'availability',
  'care_experience',
  'years_experience',
  'qualifications',
  'employment_status',
  'cv_reference',
  'certificate_references',
  'selected_plan',
  'initial_payment',
  'terms_version',
  'terms_accepted',
  'terms_accepted_at',
  'status',
];

/**
 * Columns that must be stored as plain text. A value written into a cell
 * that is not plain text is parsed by Google Sheets, so "+447700900123"
 * becomes the formula "=+447700900123" and the cell shows #ERROR!.
 * These are the identifier and phone fields; money and dates are left alone
 * so they stay sortable.
 */
const TEXT_FORMAT_FIELDS = [
  'application_id',
  'phone',
  'whatsapp',
  'cv_reference',
  'certificate_references',
  'terms_version',
];

/** Accepted header spellings for each canonical column. */
const APPLICATION_HEADER_ALIASES = {
  application_id: ['application_id', 'applicationid', 'id'],
  submitted_at: ['submitted_at', 'submittedat'],
  full_name: ['full_name', 'fullname'],
  email: ['email', 'email_address'],
  phone: ['phone', 'phone_number', 'telephone'],
  whatsapp: ['whatsapp', 'whatsapp_number'],
  country: ['country'],
  uk_location: ['uk_location', 'uklocation'],
  role: ['role'],
  preferred_location: ['preferred_location', 'preferredlocation'],
  work_type: ['work_type', 'worktype'],
  employment_preference: ['employment_preference', 'employmentpreference'],
  availability: ['availability'],
  care_experience: ['care_experience', 'careexperience'],
  years_experience: ['years_experience', 'yearsexperience'],
  qualifications: ['qualifications'],
  employment_status: ['employment_status', 'employmentstatus'],
  cv_reference: ['cv_reference', 'cvreference'],
  certificate_references: ['certificate_references', 'certificatereferences'],
  selected_plan: ['selected_plan', 'selectedplan'],
  initial_payment: ['initial_payment', 'initialpayment'],
  terms_version: ['terms_version', 'termsversion'],
  terms_accepted: ['terms_accepted', 'termsaccepted'],
  terms_accepted_at: ['terms_accepted_at', 'termsacceptedat'],
  status: ['status'],
};

const POPULATION_BATCH_SIZE = 5;

function toText(value) {
  return value === null || value === undefined ? '' : String(value).trim();
}

function slugify(value) {
  return toText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function isActive(value) {
  if (typeof value === 'boolean') {
    return value;
  }

  return ['true', 'yes', '1', 'active'].includes(
    toText(value).toLowerCase()
  );
}

// ---------------------------------------------------------------------------
// Column resolution
// ---------------------------------------------------------------------------

/** Reads the header row of a sheet as normalised slugs. */
function readHeaderSlugs(sheet) {
  const lastColumn = Math.max(sheet.getLastColumn(), 1);
  return sheet
    .getRange(1, 1, 1, lastColumn)
    .getValues()[0]
    .map(function (header) {
      return slugify(header);
    });
}

/**
 * Maps every canonical Applications column to its 1-based column number, or 0
 * when the sheet does not have that header. Returns null unless every
 * canonical column is present, because a partial match is not safe to write
 * against.
 */
function resolveColumnsByHeader(sheet) {
  const slugs = readHeaderSlugs(sheet);
  const columns = {};
  let missing = [];

  APPLICATION_HEADERS.forEach(function (name) {
    const aliases = APPLICATION_HEADER_ALIASES[name] || [name];
    let found = 0;

    for (let i = 0; i < aliases.length && !found; i++) {
      const alias = slugify(aliases[i]);
      const index = slugs.indexOf(alias);
      if (index >= 0) {
        found = index + 1;
      }
    }

    columns[name] = found;
    if (!found) {
      missing.push(name);
    }
  });

  return missing.length === 0 ? columns : null;
}

/** Reports which canonical columns the sheet is missing or has out of place. */
function describeHeaderDrift(sheet) {
  const columns = {};
  const slugs = readHeaderSlugs(sheet);

  APPLICATION_HEADERS.forEach(function (name) {
    const aliases = (APPLICATION_HEADER_ALIASES[name] || [name]).map(slugify);
    let found = 0;

    for (let i = 0; i < slugs.length; i++) {
      if (aliases.indexOf(slugs[i]) >= 0) {
        found = i + 1;
        break;
      }
    }

    columns[name] = found;
  });

  const drift = [];
  APPLICATION_HEADERS.forEach(function (name, index) {
    const actual = columns[name];
    if (actual === 0) {
      drift.push(name + ' (missing)');
    } else if (actual !== index + 1) {
      drift.push(name + ' (in column ' + actual + ', expected ' + (index + 1) + ')');
    }
  });

  return drift;
}

/**
 * Forces the given columns to plain text for every row, including rows added
 * later. Must run before any value is written to them.
 *
 * Each column is read first, so repeat calls cost a read rather than a write.
 */
function applyTextFormats(sheet, fields) {
  const columns = resolveColumnsByHeader(sheet);
  const rows = Math.max(sheet.getMaxRows(), 2);
  let applied = 0;

  fields.forEach(function (name) {
    const column = columns
      ? columns[name]
      : APPLICATION_HEADERS.indexOf(name) + 1;

    if (!column) {
      return;
    }

    if (sheet.getRange(1, column).getNumberFormat() === '@') {
      return;
    }

    sheet.getRange(1, column, rows, 1).setNumberFormat('@');
    applied++;
  });

  return applied;
}

/**
 * Recovers cells that Google Sheets turned into #ERROR! because a phone number
 * beginning with "+" was parsed as a formula. The original text is still in the
 * cell's formula, so it can be read back and rewritten as plain text.
 *
 * Run once via repairApplicationsSheet(), or on its own if old rows break.
 */
function recoverPhoneFormulas(sheet, columns) {
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return 0;
  }

  const numberOfRows = lastRow - 1;
  let repaired = 0;

  ['phone', 'whatsapp'].forEach(function (name) {
    const column = columns ? columns[name] : APPLICATION_HEADERS.indexOf(name) + 1;

    if (!column) {
      return;
    }

    const range = sheet.getRange(2, column, numberOfRows, 1);
    const values = range.getValues();
    const formulas = range.getFormulas();
    let changed = false;

    // setValues needs one line per row in the range, so unchanged rows are
    // rewritten as-is and only the errored cells are replaced.
    const updates = values.map(function (line, index) {
      const value = toText(line[0]);

      if (value && value.charAt(0) === '#') {
        const recovered = toText(formulas[index][0]).replace(/^=/, '');

        if (recovered) {
          repaired++;
          changed = true;
          return [recovered];
        }
      }

      return [line[0]];
    });

    if (changed) {
      range.setValues(updates);
      SpreadsheetApp.flush();
    }
  });

  return repaired;
}

/**
 * One-time repair. Run from the editor with repairApplicationsSheet selected.
 *
 * 1. Formats the phone and WhatsApp columns as plain text so "+44..." is never
 *    parsed as a formula again.
 * 2. Rewrites any existing #ERROR! phone cells back to the original number.
 * 3. Logs any header drift so you can see which columns do not match
 *    APPLICATION_HEADERS.
 *
 * Safe to run more than once. It never moves or deletes data.
 */
function repairApplicationsSheet() {
  const ss = SpreadsheetApp.openById(CAREERS_SPREADSHEET_ID);
  const sheet = ss.getSheetByName(APPLICATIONS_SHEET_NAME);

  if (!sheet) {
    console.error('Applications sheet not found');
    return;
  }

  console.log('=== repairApplicationsSheet START ===');
  console.log('Sheet lastRow:', sheet.getLastRow(), 'lastColumn:', sheet.getLastColumn());
  console.log('Headers found:', readHeaderSlugs(sheet).join(' | '));

  const columns = resolveColumnsByHeader(sheet);

  if (!columns) {
    console.warn(
      'WARNING: sheet headers do not match the expected order. New rows are ' +
        'written in the order listed in APPLICATION_HEADERS (phone is column 5, ' +
        'whatsapp is column 6). Drift to review:'
    );
    describeHeaderDrift(sheet).forEach(function (line) {
      console.warn('  - ' + line);
    });
  }

  const applied = applyTextFormats(sheet, TEXT_FORMAT_FIELDS);
  console.log('✓ Formatted', applied, 'columns as plain text:', TEXT_FORMAT_FIELDS.join(', '));

  const repaired = recoverPhoneFormulas(sheet, columns);
  console.log('✓ Recovered', repaired, 'phone/WhatsApp cells that showed #ERROR!');

  if (repaired) {
    console.log('Check columns E and F to confirm the numbers are readable again.');
  }

  console.log('=== repairApplicationsSheet END ===');
}

// ---------------------------------------------------------------------------
// Web app endpoints
// ---------------------------------------------------------------------------

function doGet(e) {
  try {
    const ss = SpreadsheetApp.openById(CAREERS_SPREADSHEET_ID);
    const sheet = ss.getSheetByName(OPPORTUNITIES_SHEET_NAME);

    if (!sheet) {
      return createErrorResponse('Opportunities sheet not found');
    }

    const data = sheet.getDataRange().getValues();

    if (!data.length || !data[0].length) {
      return createSuccessResponse({ opportunities: [] });
    }

    const headers = data[0].map(function (header) {
      return toText(header).toLowerCase();
    });
    const rows = data.slice(1);

    // Guard against e being undefined (e.g., when run manually in editor)
    const parameters = (e && e.parameter) || {};
    const keyword = toText(parameters.keyword).toLowerCase();
    const location = toText(parameters.location).toLowerCase();
    const category = toText(parameters.category).toLowerCase();

    console.log('doGet params:', { keyword: keyword, location: location, category: category });

    const getValue = function (row, name) {
      const index = headers.indexOf(name.toLowerCase());
      return index >= 0 ? toText(row[index]) : '';
    };

    const opportunities = [];

    for (const row of rows) {
      const id = getValue(row, 'id') || slugify(getValue(row, 'title'));
      const title = getValue(row, 'title');
      const locationValue = getValue(row, 'location');
      const description = getValue(row, 'description');
      const categoryValue = getValue(row, 'category');
      const employmentType = getValue(row, 'employmentType');
      const availability = getValue(row, 'availability');
      const activeValue = getValue(row, 'active');

      if (
        !title ||
        !locationValue ||
        !description ||
        !categoryValue ||
        !employmentType ||
        !availability
      ) {
        continue;
      }

      if (!isActive(activeValue)) {
        continue;
      }

      if (
        keyword &&
        !title.toLowerCase().includes(keyword) &&
        !description.toLowerCase().includes(keyword) &&
        !categoryValue.toLowerCase().includes(keyword) &&
        !employmentType.toLowerCase().includes(keyword)
      ) {
        continue;
      }

      if (location && !locationValue.toLowerCase().includes(location)) {
        continue;
      }

      if (category) {
        const catLower = categoryValue.toLowerCase();
        const catSlug = slugify(categoryValue);
        if (catLower !== category && catSlug !== category) {
          continue;
        }
      }

      opportunities.push({
        id: id,
        title: title,
        location: locationValue,
        description: description,
        category: categoryValue,
        employmentType: employmentType,
        availability: availability,
        active: true,
      });
    }

    opportunities.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });

    console.log('doGet returning', opportunities.length, 'opportunities');
    return createSuccessResponse({ opportunities: opportunities });
  } catch (error) {
    return createErrorResponse(error.toString());
  }
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById(CAREERS_SPREADSHEET_ID);
    const sheet = ss.getSheetByName(APPLICATIONS_SHEET_NAME);

    if (!sheet) {
      return createErrorResponse('Applications sheet not found');
    }

    if (!e.postData || !e.postData.contents) {
      return createErrorResponse('Missing request body');
    }

    let data;

    try {
      data = JSON.parse(e.postData.contents);
    } catch (error) {
      return createErrorResponse('Invalid JSON payload');
    }

    const required = [
      'applicationId',
      'submittedAt',
      'fullName',
      'email',
      'phone',
      'whatsapp',
      'country',
      'role',
      'preferredLocation',
      'workType',
      'employmentPreference',
      'availability',
      'qualifications',
      'employmentStatus',
      'selectedPlan',
      'initialPaymentPence',
      'termsVersion',
      'termsAccepted',
      'termsAcceptedAt',
    ];

    for (const field of required) {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        return createErrorResponse('Missing required field: ' + field);
      }
    }

    const columns = resolveColumnsByHeader(sheet);

    if (!columns) {
      console.warn(
        'Sheet headers do not match APPLICATION_HEADERS — writing in canonical ' +
          'order instead. Run repairApplicationsSheet() to see the drift.'
      );
      describeHeaderDrift(sheet).forEach(function (line) {
        console.warn('  - ' + line);
      });
    }

    const values = {
      application_id: data.applicationId,
      submitted_at: data.submittedAt,
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      whatsapp: data.whatsapp,
      country: data.country,
      uk_location: data.ukLocation || '',
      role: data.role,
      preferred_location: data.preferredLocation,
      work_type: data.workType,
      employment_preference: data.employmentPreference,
      availability: data.availability,
      care_experience: data.careExperience ? 'Yes' : 'No',
      years_experience:
        data.yearsExperience === undefined || data.yearsExperience === null
          ? ''
          : data.yearsExperience,
      qualifications: data.qualifications,
      employment_status: data.employmentStatus,
      cv_reference: data.cvReference || '',
      certificate_references: (data.certificateReferences || []).join(', '),
      selected_plan: data.selectedPlan,
      initial_payment: data.initialPaymentPence,
      terms_version: data.termsVersion,
      terms_accepted: data.termsAccepted,
      terms_accepted_at: data.termsAcceptedAt,
      status: data.status || 'New',
    };

    // Text format first, so a value like "+447700900123" is stored as text
    // instead of being parsed as a formula.
    applyTextFormats(sheet, TEXT_FORMAT_FIELDS);

    // Build a full-width row and place each value at its column, so the write
    // is correct whether the sheet follows APPLICATION_HEADERS or not.
    const width = Math.max(
      sheet.getLastColumn(),
      APPLICATION_HEADERS.length
    );
    const row = new Array(width).fill('');

    APPLICATION_HEADERS.forEach(function (name, index) {
      const column = columns ? columns[name] : index + 1;
      row[column - 1] = values[name];
    });

    sheet.appendRow(row);
    SpreadsheetApp.flush();

    console.log('Application written:', data.applicationId, '| phone:', values.phone);

    return createSuccessResponse({
      applicationId: data.applicationId,
      message: 'Application submitted successfully.',
    });
  } catch (error) {
    return createErrorResponse(error.toString());
  }
}

function createSuccessResponse(data) {
  const payload = Object.assign({ ok: true }, data);
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function createErrorResponse(message) {
  console.error('Apps Script error: ' + message);
  const output = ContentService.createTextOutput(
    JSON.stringify({ ok: false, error: message })
  ).setMimeType(ContentService.MimeType.JSON);
  return output;
}

/**
 * Populates the Opportunities sheet with header + 10 demo records.
 * Safe to run multiple times — will not create duplicates.
 * Uses the configured Spreadsheet ID directly (works for standalone scripts).
 * Run: select 'populateOpportunities' in the Run dropdown ▶
 * After running, check Executions → logs for detailed output.
 */
function populateOpportunities() {
  const SPREADSHEET_ID = CAREERS_SPREADSHEET_ID;
  const SHEET_NAME = OPPORTUNITIES_SHEET_NAME;
  const REQUIRED_HEADERS = OPPORTUNITIES_HEADERS;

  console.log('=== populateOpportunities START ===');
  console.log('Using Spreadsheet ID:', SPREADSHEET_ID);

  // 1. Open spreadsheet by ID (works for standalone scripts)
  let ss;
  try {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    console.log('✓ Opened spreadsheet:', ss.getName(), '| ID:', ss.getId());
  } catch (e) {
    console.error('✗ Failed to open spreadsheet by ID:', e.message);
    return;
  }

  // 2. Get or create Opportunities sheet
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    console.log('Sheet "' + SHEET_NAME + '" not found — creating it');
    sheet = ss.insertSheet(SHEET_NAME);
    console.log('✓ Created sheet:', sheet.getName());
  } else {
    console.log('✓ Found existing sheet:', sheet.getName());
  }

  // 3. Diagnose current sheet state
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  console.log('Sheet stats — lastRow:', lastRow, '| lastCol:', lastCol);

  // 4. Ensure header exists in row 1 exactly as required
  let firstRowVals = [];
  if (lastRow >= 1 && lastCol >= REQUIRED_HEADERS.length) {
    firstRowVals = sheet.getRange(1, 1, 1, REQUIRED_HEADERS.length).getValues()[0];
    console.log('First row values:', firstRowVals);
  }

  const headerMatches = REQUIRED_HEADERS.every(
    (header, index) =>
      toText(firstRowVals[index]).toLowerCase() === header.toLowerCase()
  );
  console.log('Header matches exactly:', headerMatches);

  if (!headerMatches) {
    // If there is any data in row 1, shift it down to preserve it
    const firstRowHasAny = firstRowVals.some((v) => toText(v) !== '');
    if (firstRowHasAny) {
      console.log('Row 1 has data but header mismatch — inserting row 1 to preserve existing row');
      sheet.insertRows(1);
    } else {
      console.log('Writing header to row 1...');
    }
    sheet.getRange(1, 1, 1, REQUIRED_HEADERS.length).setValues([REQUIRED_HEADERS]);
    console.log('✓ Header written to row 1');
    SpreadsheetApp.flush();
  } else {
    console.log('Header already present in row 1 — skipping');
  }

  // Re-read lastRow after any header insertion
  const currentLastRow = sheet.getLastRow();

  // 5. Count existing data rows (rows after header that have data in column A)
  const headerRow = 1;
  const dataStartRow = 2;
  let existingCount = 0;
  const existingIds = new Set();

  if (currentLastRow >= dataStartRow) {
    const idColVals = sheet
      .getRange(dataStartRow, 1, currentLastRow - headerRow, 1)
      .getValues();
    idColVals.forEach((r) => {
      const id = toText(r[0]);
      if (id) {
        existingIds.add(id);
        existingCount++;
      }
    });
    console.log('Existing data rows found (row 2+):', existingCount);
    console.log('Existing IDs:', Array.from(existingIds));
  } else {
    console.log('No existing data rows found');
  }

  // 6. Data to insert (10 records)
  const newRows = [
    ['1', 'Care Assistant', 'London', 'Support residents with daily routines, personal care, and mobility. Work in a supportive team environment.', 'care-assistant', 'Full-time', 'Immediate', true],
    ['2', 'Care Assistant', 'Manchester', 'Provide compassionate care to elderly residents. Day and night shifts available.', 'care-assistant', 'Part-time', '2 weeks', true],
    ['3', 'Senior Care Assistant', 'Birmingham', 'Lead a team of care assistants. Mentor junior staff and ensure high-quality care delivery.', 'senior-care-assistant', 'Full-time', 'Immediate', true],
    ['4', 'Senior Care Assistant', 'Leeds', 'Deputy team leader role. NVQ Level 3 required. Excellent progression opportunities.', 'senior-care-assistant', 'Full-time', '1 month', true],
    ['5', 'Support Worker', 'Glasgow', 'Help adults with learning disabilities live independently. Community-based role.', 'support-worker', 'Full-time', 'Flexible', true],
    ['6', 'Healthcare Assistant', 'Edinburgh', 'Work alongside nurses in a hospital setting. Acute and community placements.', 'healthcare-assistant', 'Full-time', 'Immediate', true],
    ['7', 'Registered Nurse', 'Bristol', 'RGN/RMN pin required. Clinical leadership in a care home setting. Competitive salary.', 'registered-nurse', 'Full-time', '2 weeks', true],
    ['8', 'Senior Carer', 'Liverpool', 'Experienced carer for dementia unit. Lead care planning and family liaison.', 'senior-carer', 'Full-time', '1 month', true],
    ['9', 'Live-in Carer', 'Nationwide', 'Live-in companionship and care. 2 weeks on / 2 weeks off. Accommodation provided.', 'live-in-carer', 'Full-time', 'Flexible', true],
    ['10', 'Home Care Worker', 'Sheffield', 'Visit clients in their own homes. Driving license essential. Mileage paid.', 'home-care-worker', 'Part-time', 'Immediate', true],
  ];

  // 7. Filter out rows that already exist (by ID in column A)
  const rowsToWrite = newRows.filter((r) => !existingIds.has(toText(r[0])));
  console.log('Rows to write (after dedup):', rowsToWrite.length);

  if (rowsToWrite.length === 0) {
    console.log('All records already present — nothing to write.');
    const finalLastRow = sheet.getLastRow();
    console.log('Final sheet lastRow:', finalLastRow);
    console.log('=== populateOpportunities END ===');
    return;
  }

  // 8. Write new rows in batches, appending after existing data
  let writeStartRow = dataStartRow;
  if (currentLastRow >= dataStartRow) {
    const existingData = sheet
      .getRange(dataStartRow, 1, currentLastRow - 1, REQUIRED_HEADERS.length)
      .getValues();
    let lastNonEmptyRow = 1;
    for (let i = existingData.length - 1; i >= 0; i--) {
      if (existingData[i].some((cell) => toText(cell) !== '')) {
        lastNonEmptyRow = i + dataStartRow;
        break;
      }
    }
    writeStartRow = lastNonEmptyRow + 1;
  }

  console.log('Writing', rowsToWrite.length, 'rows starting at row', writeStartRow);

  for (let offset = 0; offset < rowsToWrite.length; offset += POPULATION_BATCH_SIZE) {
    const batch = rowsToWrite.slice(offset, offset + POPULATION_BATCH_SIZE);
    const batchStartRow = writeStartRow + offset;
    const range = sheet.getRange(
      batchStartRow,
      1,
      batch.length,
      REQUIRED_HEADERS.length
    );
    range.setValues(batch);
    SpreadsheetApp.flush();
    console.log('✓ Wrote batch of', batch.length, 'rows at row', batchStartRow);
  }

  // 9. Final verification
  const finalLastRow = sheet.getLastRow();
  const dataHeight = Math.max(finalLastRow - headerRow, 0);
  let finalDataCount = 0;
  if (dataHeight > 0) {
    const finalData = sheet
      .getRange(dataStartRow, 1, dataHeight, REQUIRED_HEADERS.length)
      .getValues();
    finalDataCount = finalData.filter((row) =>
      row.some((cell) => toText(cell) !== '')
    ).length;
  }
  console.log('Final sheet lastRow:', finalLastRow);
  console.log(
    'Final data rows (non-empty):',
    finalDataCount,
    '(expected:',
    existingCount + rowsToWrite.length + ')'
  );
  console.log('=== populateOpportunities END ===');
}