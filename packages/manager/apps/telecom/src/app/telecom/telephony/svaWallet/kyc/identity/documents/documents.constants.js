export const STATUS = {
  EXPIRED: 'EXPIRED',
  INIT: 'INIT',
  INVALID: 'INVALID',
  NEED_MANUAL_VALIDATION: 'NEED_MANUAL_VALIDATION',
  PENDING: 'PENDING',
  REJECTED: 'REJECTED',
  UP_TO_DATE: 'UP_TO_DATE',
  WAITING_FOR_UPLOAD: 'WAITING_FOR_UPLOAD',
};

export const STATUS_DOWNLOAD = [
  STATUS.INIT,
  STATUS.WAITING_FOR_UPLOAD,
  STATUS.INVALID,
  STATUS.REJECTED,
  STATUS.EXPIRED,
];

export const STATUS_OK = [STATUS.UP_TO_DATE];

export const STATUS_PENDING = [STATUS.NEED_MANUAL_VALIDATION, STATUS.PENDING];

export const canUpload = (document) =>
  STATUS_DOWNLOAD.includes(document.status);

export const isValid = (document) => STATUS_OK.includes(document.status);

export const isPending = (document) => STATUS_PENDING.includes(document.status);

export const areAllDocumentsUploaded = (documents) =>
  !documents.some((document) => {
    return canUpload(document);
  });

export const getBeneficiaries = (wallet) => {
  return [
    ...wallet.company.beneficiaries,
    ...(wallet.company.representativeIsBeneficiary
      ? [wallet.company.representative]
      : []),
  ];
};

export const getBeneficiary = (wallet, searchId) =>
  getBeneficiaries(wallet).find((beneficiary) => beneficiary.id === searchId);

export const DOCUMENT_TYPE_TO_DEFINE = 'NONE';

export const AVALABLE_DOCUMENT_TYPES_BY_NATURE = {
  ADMINISTRATION_MANDATE: ['COMPANY_REGISTRATION'],
  BODACC_DOCUMENT: ['OTHER'],
  BUSINESS_REGISTER_CERTIFICATE: ['COMPANY_REGISTRATION'],
  COMMERCIAL_CORPORATE_REGISTER_CERTIFICATE: ['COMPANY_REGISTRATION'],
  COMPANY_STATUTES: ['STATUS'],
  FOUND_RULES: ['OTHER'],
  FOUNDATION_IDENTITY_PROOF: ['COMPANY_REGISTRATION'],
  GENERAL_ASSEMBLY_DOCUMENT: ['COMPANY_REGISTRATION'],
  IBAN: ['IBAN'],
  JOAFE_DOCUMENT: ['OTHER'],
  KBIS: ['COMPANY_REGISTRATION'],
  LAST_GENERAL_MEETING_REPORT: ['COMPANY_REGISTRATION'],
  MICRO_ENTERPRISE_DOCUMENT: ['COMPANY_REGISTRATION'],
  PROOF_OF_IDENTITY: [
    'ADDRESS_PROOF',
    'ID',
    'DRIVER_LICENCE',
    'PASSEPORT_EU',
    'PASSEPORT_OTHER',
    'RESIDENCE_PERMIT',
  ],
  SECONDARY_PROOF_OF_IDENTITY: [
    'ADDRESS_PROOF',
    'ID',
    'DRIVER_LICENCE',
    'PASSEPORT_EU',
    'PASSEPORT_OTHER',
    'RESIDENCE_PERMIT',
  ],
  RESELLER_PROOF: ['OTHER'],
};

export const getAvalaibleTypes = (nature, type) => {
  if (type === DOCUMENT_TYPE_TO_DEFINE) {
    return AVALABLE_DOCUMENT_TYPES_BY_NATURE[nature] || [];
  }
  return [];
};

export const findDocumentType = (nature, type) => {
  if (type === DOCUMENT_TYPE_TO_DEFINE) {
    const types = getAvalaibleTypes(nature, type);
    if (types.length === 1) {
      return types[0];
    }
  }
  return type;
};

export const formatDocument = (svaWallet, document, getAvailableTypesList) => {
  const documentType = findDocumentType(document.nature, document.type);
  return {
    ...document,
    beneficiary: getBeneficiary(svaWallet, document.personalInfoId),
    isValid: isValid(document),
    isPending: isPending(document),
    canUpload: canUpload(document),
    availableTypes: getAvailableTypesList(
      getAvalaibleTypes(document.nature, documentType),
    ),
    type: documentType,
    selectedType: null,
  };
};

export const formatDocuments = (svaWallet, documents, getAvailableTypesList) =>
  documents.map((document) =>
    formatDocument(svaWallet, document, getAvailableTypesList),
  );

export default {
  STATUS,
  canUpload,
  isValid,
  isPending,
  getBeneficiaries,
  getBeneficiary,
  DOCUMENT_TYPE_TO_DEFINE,
  AVALABLE_DOCUMENT_TYPES_BY_NATURE,
  getAvalaibleTypes,
  findDocumentType,
  formatDocuments,
};
