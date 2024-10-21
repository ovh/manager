export const USER_TYPE = {
  corporation: 'enterprise',
  association: 'association',
  individual: 'particular',
  institution: 'institution',
  default: 'others',
};

export const PAGE_TYPE = ['front', 'back', 'last-page'];

export const PROOF_TYPE = {
  aadhaar_card: 'aadhaar_card',
  address: 'address',
  identity: 'identity',
  vat: 'vat',
  authority_declaration: 'authority_declaration',
};

export const DOCUMENT_TYPE = {
  aadhaar_card: 'aadhaar_card',
  id_card: 'id_card',
  passport: 'passport',
  driving_licence: 'driving_licence',
  voter_indian_id_card: 'voter_indian_id_card',
  gst_certificate: 'gst_certificate',
  bill: 'bill',
  bank_statement: 'bank_statement',
  authority_declaration: 'authority_declaration',
};

export const DOCUMENT_ACCEPTANCE_CRITERIA = {
  complete: 'complete',
  up_to_date: 'up_to_date',
  face_visible: 'face_visible',
  names_account: 'names_account',
  names_address_account: 'names_address_account',
  less_than_three: 'less_than_three',
  address_gst: 'address_gst',
  address_account: 'address_account',
  company_name_vat: 'company_name_vat',
  mandatory_names: 'mandatory_names',
  names_date_sign_gst: 'names_date_sign_gst',
  delegate_dates: 'delegate_dates',
};

const DOCUMENT_INDIVIDUAL_MATRIX = {
  aadhaar_card: {
    extended: false,
    documents: {
      aadhaar_card: {
        quantity: 2,
        mandatory: 2,
        acceptance_criteria: [
          DOCUMENT_ACCEPTANCE_CRITERIA.names_account,
          DOCUMENT_ACCEPTANCE_CRITERIA.up_to_date,
          DOCUMENT_ACCEPTANCE_CRITERIA.face_visible,
        ],
      },
    },
  },
  identity: {
    extended: false,
    documents: {
      aadhaar_card: {
        quantity: 2,
        mandatory: 2,
        acceptance_criteria: [
          DOCUMENT_ACCEPTANCE_CRITERIA.names_account,
          DOCUMENT_ACCEPTANCE_CRITERIA.up_to_date,
          DOCUMENT_ACCEPTANCE_CRITERIA.face_visible,
        ],
      },
      id_card: {
        quantity: 2,
        mandatory: 2,
        acceptance_criteria: [
          DOCUMENT_ACCEPTANCE_CRITERIA.names_account,
          DOCUMENT_ACCEPTANCE_CRITERIA.up_to_date,
          DOCUMENT_ACCEPTANCE_CRITERIA.face_visible,
        ],
      },
      passport: {
        quantity: 1,
        mandatory: 1,
        acceptance_criteria: [
          DOCUMENT_ACCEPTANCE_CRITERIA.names_account,
          DOCUMENT_ACCEPTANCE_CRITERIA.up_to_date,
          DOCUMENT_ACCEPTANCE_CRITERIA.face_visible,
        ],
      },
      driving_licence: {
        quantity: 1,
        mandatory: 1,
        acceptance_criteria: [
          DOCUMENT_ACCEPTANCE_CRITERIA.names_account,
          DOCUMENT_ACCEPTANCE_CRITERIA.up_to_date,
          DOCUMENT_ACCEPTANCE_CRITERIA.face_visible,
        ],
      },
      voter_indian_id_card: {
        quantity: 1,
        mandatory: 1,
        acceptance_criteria: [
          DOCUMENT_ACCEPTANCE_CRITERIA.names_account,
          DOCUMENT_ACCEPTANCE_CRITERIA.up_to_date,
          DOCUMENT_ACCEPTANCE_CRITERIA.face_visible,
        ],
      },
    },
  },
  address: {
    extended: false,
    documents: {
      aadhaar_card: {
        quantity: 2,
        mandatory: 2,
        acceptance_criteria: [
          DOCUMENT_ACCEPTANCE_CRITERIA.names_address_account,
        ],
      },
      gst_certificate: {
        quantity: 1,
        mandatory: 1,
        acceptance_criteria: [
          DOCUMENT_ACCEPTANCE_CRITERIA.names_address_account,
        ],
      },
      bill: {
        quantity: 1,
        mandatory: 1,
        acceptance_criteria: [
          DOCUMENT_ACCEPTANCE_CRITERIA.names_address_account,
          DOCUMENT_ACCEPTANCE_CRITERIA.less_than_three,
        ],
      },
      bank_statement: {
        quantity: 1,
        mandatory: 1,
        acceptance_criteria: [
          DOCUMENT_ACCEPTANCE_CRITERIA.names_address_account,
        ],
      },
    },
  },
};

const DOCUMENT_NON_INDIVIDUAL_MATRIX = {
  identity: {
    extended: true,
    documents: {
      aadhaar_card: {
        quantity: 2,
        mandatory: 2,
        acceptance_criteria: [
          DOCUMENT_ACCEPTANCE_CRITERIA.up_to_date,
          DOCUMENT_ACCEPTANCE_CRITERIA.face_visible,
        ],
      },
      id_card: {
        quantity: 2,
        mandatory: 2,
        acceptance_criteria: [
          DOCUMENT_ACCEPTANCE_CRITERIA.up_to_date,
          DOCUMENT_ACCEPTANCE_CRITERIA.face_visible,
        ],
      },
      passport: {
        quantity: 1,
        mandatory: 1,
        acceptance_criteria: [
          DOCUMENT_ACCEPTANCE_CRITERIA.up_to_date,
          DOCUMENT_ACCEPTANCE_CRITERIA.face_visible,
        ],
      },
      driving_licence: {
        quantity: 1,
        mandatory: 1,
        acceptance_criteria: [
          DOCUMENT_ACCEPTANCE_CRITERIA.up_to_date,
          DOCUMENT_ACCEPTANCE_CRITERIA.face_visible,
        ],
      },
      voter_indian_id_card: {
        quantity: 1,
        mandatory: 1,
        acceptance_criteria: [
          DOCUMENT_ACCEPTANCE_CRITERIA.up_to_date,
          DOCUMENT_ACCEPTANCE_CRITERIA.face_visible,
        ],
      },
    },
  },
  address: {
    extended: false,
    documents: {
      gst_certificate: {
        quantity: 1,
        mandatory: 1,
        acceptance_criteria: [
          DOCUMENT_ACCEPTANCE_CRITERIA.address_gst,
          DOCUMENT_ACCEPTANCE_CRITERIA.address_account,
        ],
      },
      bill: {
        quantity: 1,
        mandatory: 1,
        acceptance_criteria: [
          DOCUMENT_ACCEPTANCE_CRITERIA.address_gst,
          DOCUMENT_ACCEPTANCE_CRITERIA.address_account,
          DOCUMENT_ACCEPTANCE_CRITERIA.less_than_three,
        ],
      },
      bank_statement: {
        quantity: 1,
        mandatory: 1,
        acceptance_criteria: [
          DOCUMENT_ACCEPTANCE_CRITERIA.names_address_account,
        ],
      },
    },
  },
  vat: {
    extended: false,
    documents: {
      gst_certificate: {
        quantity: 1,
        mandatory: 1,
        extended: true,
        acceptance_criteria: [
          DOCUMENT_ACCEPTANCE_CRITERIA.company_name_vat,
          DOCUMENT_ACCEPTANCE_CRITERIA.mandatory_names,
          DOCUMENT_ACCEPTANCE_CRITERIA.complete,
        ],
      },
    },
  },
  authority_declaration: {
    extended: true,
    documents: {
      authority_declaration: {
        quantity: 1,
        mandatory: 1,
        acceptance_criteria: [
          DOCUMENT_ACCEPTANCE_CRITERIA.names_date_sign_gst,
          DOCUMENT_ACCEPTANCE_CRITERIA.delegate_dates,
        ],
      },
    },
  },
};

export const DOCUMENTS_MATRIX = {
  particular: {
    extended: false,
    proofs: DOCUMENT_INDIVIDUAL_MATRIX,
  },
  enterprise: {
    extended: false,
    proofs: DOCUMENT_NON_INDIVIDUAL_MATRIX,
  },
  association: {
    extended: false,
    proofs: DOCUMENT_NON_INDIVIDUAL_MATRIX,
  },
  others: {
    extended: true,
    proofs: DOCUMENT_NON_INDIVIDUAL_MATRIX,
  },
};

export const LEGAL_LINK1 =
  'https://www.cert-in.org.in/PDF/CERT-In_Directions_70B_28.04.2022.pdf';
export const LEGAL_LINK2 =
  'https://www.cert-in.org.in/PDF/CERT-In_Directions_70B_28.04.2022.pdf';
export const LEGAL_LINK3 = {
  FR: 'https://www.ovhcloud.com/fr/terms-and-conditions/privacy-policy/',
  DE: 'https://www.ovhcloud.com/de/terms-and-conditions/privacy-policy/',
  ES: 'https://www.ovhcloud.com/es-es/terms-and-conditions/privacy-policy/',
  IT: 'https://www.ovhcloud.com/it/terms-and-conditions/privacy-policy/',
  PL: 'https://www.ovhcloud.com/pl/terms-and-conditions/privacy-policy/',
  PT: 'https://www.ovhcloud.com/pt/terms-and-conditions/privacy-policy/',
  IN: 'https://www.ovhcloud.com/en-in/terms-and-conditions/privacy-policy/',
  OTHERS: 'https://www.ovhcloud.com/en-gb/terms-and-conditions/privacy-policy/',
};

export const MAX_SIZE = 10000000;

export const TRACKING_PREFIX = 'Hub::account::identity-files';

export const TRACKING_TASK_TAG = {
  dashboard: `${TRACKING_PREFIX}::identity-files::dashboard`,
  openDetailView: `${TRACKING_PREFIX}::tile::button::{{name_click}}_identity-files::{{identity-files}}`,
  clickSendMyDocuments: `${TRACKING_PREFIX}::page::button::submit_identity-files`,
  displayPopUpSendMyDocuments: `${TRACKING_PREFIX}::identity-files::pop-up::identity-files-sent`,
  confirmSendMyDocuments: `${TRACKING_PREFIX}::identity-files::pop-up::button::identity-files-sent::confirm`,
};

export const TRACKING_VARIABLES = {
  TO_ADD: 'to_add',
  MODIFY: 'modify',
};

export const KYC_STATUS = {
  OPEN: 'open',
  REQUIRED: 'required',
  OK: 'ok',
};

export const KYC_ALLOWED_FILE_EXTENSIONS = ['jpg', 'jpeg', 'pdf', 'png'];

export const DELAY_BETWEEN_RETRY = 3 * 1000;

export const MAX_RETRIES = 1;

export default {
  USER_TYPE,
  MAX_SIZE,
  TRACKING_PREFIX,
  TRACKING_TASK_TAG,
  LEGAL_LINK1,
  LEGAL_LINK2,
  LEGAL_LINK3,
  KYC_STATUS,
  KYC_ALLOWED_FILE_EXTENSIONS,
  DELAY_BETWEEN_RETRY,
  MAX_RETRIES,
};
