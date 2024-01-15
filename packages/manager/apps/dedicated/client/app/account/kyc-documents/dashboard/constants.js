export const MAXIMUM_SIZE = 10000000;
export const MAXIMUM_DOCUMENTS = 10;
const TRACKING_DOCUMENTS = 'dedicated::account::my-documents';
export const TRACKING = {
  DOCUMENTS: TRACKING_DOCUMENTS,
  CTA_SEND_DOCUMENTS: `${TRACKING_DOCUMENTS}::upload`,
  CTA_CONFIRM: `${TRACKING_DOCUMENTS}::upload-confirm`,
  CTA_CANCEL: `${TRACKING_DOCUMENTS}::upload-cancel`,
  UPLOAD_SUCCESS: `${TRACKING_DOCUMENTS}::upload-success`,
  UPLOAD_ERROR: `${TRACKING_DOCUMENTS}::upload-error`,
  CTA_DASHBOARD: `${TRACKING_DOCUMENTS}::goto-hub`,
};

export const DOCUMENT_TYPE = {
  ID: 'ID',
  PROOF_OF_ADRESS: 'PROOF_OF_ADRESS',
  CORPORATE_ID: 'CORPORATE_ID',
  ASSOCIATION_ID: 'ASSOCIATION_ID',
  ADMINISTRATION_ID: 'ADMINISTRATION_ID',
  OTHER: 'OTHER',
};

export const LEGAL_FORMS = {
  INDIVIDUAL: 'individual',
  ADMINISTRATION: 'administration',
  CORPORATION: 'corporation',
  PERSONALCORPORATION: 'personalcorporation',
  ASSOCIATION: 'association',
  OTHER: 'other',
};

export const DOCUMENT_LIST = {
  individual: {
    mandatory: [DOCUMENT_TYPE.PROOF_OF_ADRESS, DOCUMENT_TYPE.ID],
    optional: [DOCUMENT_TYPE.OTHER],
  },
  administration: {
    mandatory: [DOCUMENT_TYPE.ID, DOCUMENT_TYPE.ADMINISTRATION_ID],
    optional: [DOCUMENT_TYPE.OTHER],
  },
  corporation: {
    mandatory: [DOCUMENT_TYPE.ID, DOCUMENT_TYPE.CORPORATE_ID],
    optional: [DOCUMENT_TYPE.OTHER],
  },
  personalcorporation: {
    mandatory: [DOCUMENT_TYPE.ID, DOCUMENT_TYPE.CORPORATE_ID],
    optional: [DOCUMENT_TYPE.OTHER],
  },
  association: {
    mandatory: [DOCUMENT_TYPE.ID, DOCUMENT_TYPE.ASSOCIATION_ID],
    optional: [DOCUMENT_TYPE.OTHER],
  },
};

export const PRIVACY_LINKS = {
  DEFAULT:
    'https://www.ovhcloud.com/en-ie/terms-and-conditions/privacy-policy/',
  CA: 'https://www.ovhcloud.com/en-ca/terms-and-conditions/privacy-policy/',
  DE: 'https://www.ovhcloud.com/de/terms-and-conditions/privacy-policy/',
  ES: 'https://www.ovhcloud.com/es-es/terms-and-conditions/privacy-policy/',
  FR: 'https://www.ovhcloud.com/fr/terms-and-conditions/privacy-policy/',
  GB: 'https://www.ovhcloud.com/en-gb/terms-and-conditions/privacy-policy/',
  IE: 'https://www.ovhcloud.com/fr/terms-and-conditions/privacy-policy/',
  IT: 'https://www.ovhcloud.com/it/terms-and-conditions/privacy-policy/',
  NL: 'https://www.ovhcloud.com/nl/terms-and-conditions/privacy-policy/',
  PL: 'https://www.ovhcloud.com/pl/terms-and-conditions/privacy-policy/',
  PT: 'https://www.ovhcloud.com/pt/terms-and-conditions/privacy-policy/',
  US: 'https://us.ovhcloud.com/legal/privacy-policy/',
  WE: 'https://www.ovhcloud.com/en-ie/terms-and-conditions/privacy-policy/',
};

export default {
  DOCUMENT_TYPE,
  DOCUMENT_LIST,
  MAXIMUM_SIZE,
  LEGAL_FORMS,
  MAXIMUM_DOCUMENTS,
  PRIVACY_LINKS,
};
