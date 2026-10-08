// @source: https://en.wikipedia.org/wiki/VAT_identification_number
export const COUNTRIES_VAT_LABEL = {
  AT: 'UID',
  BE: 'TVA',
  CY: 'ΦΠΑ',
  CZ: 'DIČ',
  DE: 'USt-IdNr.',
  DK: 'CVR',
  EE: 'KMKR',
  GR: 'ΑΦΜ',
  ES: 'NIF',
  FI: 'ALV nro',
  FR: 'TVA',
  HR: 'PDV-ID',
  HU: 'ANUM',
  IE: 'VAT',
  IT: 'IVA',
  LT: 'PVM kodas',
  LU: 'TVA',
  LV: 'PVN',
  MT: 'Vat No.',
  NL: 'Btw-nr.',
  PL: 'NIP',
  PT: 'NIF',
  RO: 'CIF',
  SE: 'Momsnr.',
  SI: 'ID za DDV',
  SK: 'IČ DPH',
  AL: 'NIPT',
  MK: 'ЕДБ',
  AU: 'ABN',
  BY: 'УНП / UNP',
  CA: 'BN / NE',
  IS: 'VSK / VASK',
  IN: 'VAT TIN / CST TIN',
  ID: 'NPWP',
  KZ: 'БСН / BIN',
  NZ: 'GST/IRD',
  NG: 'VAT',
  NO: 'Orgnr',
  PH: 'TIN',
  RU: 'ИНН',
  SM: 'C.O.E.',
  RS: 'PIB',
  CH: 'MWST / TVA / IVA',
  TR: 'KDV',
  UA: 'ІНПП',
  GB: 'VAT Reg No',
  UZ: 'СТИР',
  AR: 'CUIT',
  BO: 'NIT',
  BR: 'CNPJ',
  CL: 'RUT',
  CO: 'NIT',
  EC: 'RUC',
  SV: 'NIT',
  GT: 'NIT',
  HN: 'RTN',
  MX: 'RFC',
  NI: 'RUC',
  PA: 'RUC',
  PY: 'RUC',
  PE: 'RUC',
  DO: 'RNC',
  UY: 'RUT',
  VE: 'RIF',
  MA: 'ICE',
};

// Local names of the national identification numbers, per country of the
// customer. Countries missing from these maps keep the generic label.
export const COUNTRIES_CNIN_LABEL = {
  TR: 'MERSIS No',
};

export const COUNTRIES_NIN_LABEL = {
  TR: 'VKN',
};

// TR: the MERSİS No is 16 digits, of which the first 10 are the company's VAT
// number (VKN, labelled "KDV" on the form).
const MERSIS_NO_PATTERN = /^\d{16}$/;
const MERSIS_NO_VAT_LENGTH = 10;

const getVatFromMersisNo = (mersisNo) =>
  MERSIS_NO_PATTERN.test(mersisNo)
    ? mersisNo.slice(0, MERSIS_NO_VAT_LENGTH)
    : null;

// Countries whose VAT number is contained in the company national
// identification number. Countries missing from this map keep a free VAT
// field: nothing is derived and nothing is checked.
export const COUNTRIES_VAT_FROM_CNIN = {
  TR: getVatFromMersisNo,
};

const SIRET_TRACKING_PREFIX = 'accountcreation::company-search';
export const COMPANY_CREATED_PREFIX = `${SIRET_TRACKING_PREFIX}::company-created`;
export const COMPANY_NOT_CREATED_PREFIX = `${SIRET_TRACKING_PREFIX}::company-not-created`;

export default {
  COMPANY_CREATED_PREFIX,
  COMPANY_NOT_CREATED_PREFIX,
  COUNTRIES_CNIN_LABEL,
  COUNTRIES_NIN_LABEL,
  COUNTRIES_VAT_FROM_CNIN,
  COUNTRIES_VAT_LABEL,
};
