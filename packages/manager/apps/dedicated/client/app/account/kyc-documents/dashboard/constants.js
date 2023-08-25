export const MAXIMUM_SIZE = 10000000;
export const MAXIMUM_DOCUMENTS = 10;

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

export default {
  DOCUMENT_TYPE,
  DOCUMENT_LIST,
  MAXIMUM_SIZE,
  LEGAL_FORMS,
  MAXIMUM_DOCUMENTS,
};
