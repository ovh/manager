export const DOCUMENT_TYPE_2 = {
  ID: 'ID',
  PROOF_OF_ADRESS: 'PROOF_OF_ADRESS',
  PROOF_OF_BILLING: 'PROOF_OF_BILLING',
  OTHER_INDIVIDUAL: 'OTHER',
  KBIS: 'KBIS',
  ALL_REGISTRIES: 'ALL_REGISTRIES',
  TRADE_REGISTRY: 'TRADE_REGISTRY',
  CIF: 'CIF',
  OTHER_CORPORATE: 'OTHER_CORPORATE',
  INSEE: 'INSEE',
  TRANSCRIPT: 'TRANSCRIPT',
};

export const DOCUMENT_TYPE = {
  ID: 'ID',
  PROOF_OF_ADRESS: 'PROOF_OF_ADRESS',
  CORPORATE_ID: 'CORPORATE_ID',
  ASSOCIATION_ID: 'ASSOCIATION_ID',
  ADMINISTRATION_ID: 'ADMINISTRATION_ID',
  OTHER: 'OTHER',
};

export const DOCUMENT_LIST = {
  individual: [
    DOCUMENT_TYPE.PROOF_OF_ADRESS,
    DOCUMENT_TYPE.ID,
    DOCUMENT_TYPE.OTHER,
  ],
  administration: [
    DOCUMENT_TYPE.ID,
    DOCUMENT_TYPE.ADMINISTRATION_ID,
    DOCUMENT_TYPE.OTHER,
  ],
  corporation: [
    DOCUMENT_TYPE.ID,
    DOCUMENT_TYPE.CORPORATE_ID,
    DOCUMENT_TYPE.OTHER,
  ],
  personalcorporation: [
    DOCUMENT_TYPE.ID,
    DOCUMENT_TYPE.CORPORATE_ID,
    DOCUMENT_TYPE.OTHER,
  ],
  association: [
    DOCUMENT_TYPE.ID,
    DOCUMENT_TYPE.ASSOCIATION_ID,
    DOCUMENT_TYPE.OTHER,
  ],
};

export const DOCUMENT_LIST_2 = {
  individual: {
    DE: [
      DOCUMENT_TYPE_2.PROOF_OF_ADRESS,
      DOCUMENT_TYPE_2.ID,
      DOCUMENT_TYPE_2.OTHER,
    ],
    ES: [
      DOCUMENT_TYPE_2.PROOF_OF_ADRESS,
      DOCUMENT_TYPE_2.ID,
      DOCUMENT_TYPE_2.OTHER,
    ],
    FR: [
      DOCUMENT_TYPE_2.PROOF_OF_ADRESS,
      DOCUMENT_TYPE_2.ID,
      DOCUMENT_TYPE_2.OTHER,
    ],
    IT: [
      DOCUMENT_TYPE_2.PROOF_OF_ADRESS,
      DOCUMENT_TYPE_2.ID,
      DOCUMENT_TYPE_2.OTHER,
    ],
    MA: [
      DOCUMENT_TYPE_2.PROOF_OF_ADRESS,
      DOCUMENT_TYPE_2.ID,
      DOCUMENT_TYPE_2.OTHER,
    ],
    PL: [
      DOCUMENT_TYPE_2.PROOF_OF_ADRESS,
      DOCUMENT_TYPE_2.ID,
      DOCUMENT_TYPE_2.OTHER,
    ],
    PT: [
      DOCUMENT_TYPE_2.PROOF_OF_ADRESS,
      DOCUMENT_TYPE_2.ID,
      DOCUMENT_TYPE_2.OTHER,
    ],
    SN: [
      DOCUMENT_TYPE_2.PROOF_OF_ADRESS,
      DOCUMENT_TYPE_2.ID,
      DOCUMENT_TYPE_2.OTHER,
    ],
    TN: [
      DOCUMENT_TYPE_2.PROOF_OF_ADRESS,
      DOCUMENT_TYPE_2.ID,
      DOCUMENT_TYPE_2.OTHER,
    ],
    QC: [
      DOCUMENT_TYPE_2.PROOF_OF_ADRESS,
      DOCUMENT_TYPE_2.ID,
      DOCUMENT_TYPE_2.OTHER,
    ],
    WS: [
      DOCUMENT_TYPE_2.PROOF_OF_ADRESS,
      DOCUMENT_TYPE_2.ID,
      DOCUMENT_TYPE_2.OTHER,
    ],
    DEFAULT: [
      DOCUMENT_TYPE_2.PROOF_OF_BILLING,
      DOCUMENT_TYPE_2.ID,
      DOCUMENT_TYPE_2.OTHER,
    ],
  },
  administration: {
    DE: [],
    ES: [],
    FR: [],
    IT: [],
    MA: [],
    PL: [],
    PT: [],
    SN: [],
    TN: [],
    QC: [],
    WS: [],
    DEFAULT: [],
  },
  corporation: {
    DE: [
      DOCUMENT_TYPE_2.ID,
      DOCUMENT_TYPE_2.TRADE_REGISTRY,
      DOCUMENT_TYPE_2.OTHER_CORPORATE,
    ],
    ES: [DOCUMENT_TYPE_2.ID],
    FR: [
      DOCUMENT_TYPE_2.ID,
      DOCUMENT_TYPE_2.KBIS,
      DOCUMENT_TYPE_2.OTHER_CORPORATE,
    ],
    IT: [DOCUMENT_TYPE_2.ID],
    MA: [
      DOCUMENT_TYPE_2.ID,
      DOCUMENT_TYPE_2.ALL_REGISTRIES,
      DOCUMENT_TYPE_2.OTHER_CORPORATE,
    ],
    PL: [DOCUMENT_TYPE_2.ID],
    PT: [DOCUMENT_TYPE_2.ID],
    SN: [
      DOCUMENT_TYPE_2.ID,
      DOCUMENT_TYPE_2.ALL_REGISTRIES,
      DOCUMENT_TYPE_2.OTHER_CORPORATE,
    ],
    TN: [
      DOCUMENT_TYPE_2.ID,
      DOCUMENT_TYPE_2.ALL_REGISTRIES,
      DOCUMENT_TYPE_2.OTHER_CORPORATE,
    ],
    QC: [DOCUMENT_TYPE_2.ID],
    WS: [DOCUMENT_TYPE_2.ID],
    DEFAULT: [DOCUMENT_TYPE_2.ID],
  },
  personalcorporation: {
    DE: [],
    ES: [],
    FR: [],
    IT: [],
    MA: [],
    PL: [],
    PT: [],
    SN: [],
    TN: [],
    QC: [],
    WS: [],
    DEFAULT: [],
  },
  association: {
    DE: [],
    ES: [],
    FR: [],
    IT: [],
    MA: [],
    PL: [],
    PT: [],
    SN: [],
    TN: [],
    QC: [],
    WS: [],
    DEFAULT: [],
  },
  other: {
    DE: [],
    ES: [],
    FR: [],
    IT: [],
    MA: [],
    PL: [],
    PT: [],
    SN: [],
    TN: [],
    QC: [],
    WS: [],
    DEFAULT: [],
  },
};

export default {
  DOCUMENT_TYPE,
  DOCUMENT_LIST,
  DOCUMENT_TYPE_2,
  DOCUMENT_LIST_2,
};
