export const AT_INTERNET_LEVEL2: Record<string, string> = {
  0: '',
  56: 'Cloud',
  57: 'Dedicated',
  67: 'Focus',
  81: 'Manager',
  84: 'Web',
  85: 'Server',
  86: 'PublicCloud',
  87: 'Telecom',
  88: 'Hub',
  95: 'account-creation',
  98: 'HostedPrivateCloud',
};

export const AT_INTERNET_WEBSITE: Record<string, string> = {
  ASIA: 'Asia',
  AU: 'Australia',
  CA: 'Canada',
  DE: 'Germany',
  ES: 'Spain',
  FR: 'France',
  GB: 'United Kingdom',
  IE: 'Ireland',
  IN: 'India',
  IT: 'Italy',
  MA: 'Morocco',
  NL: 'Netherlands',
  PL: 'Poland',
  PT: 'Portugal',
  QC: 'Quebec',
  SG: 'Singapore',
  SN: 'Senegal',
  TN: 'Tunisia',
  US: 'United States',
  WE: 'WorldEnglish',
  WS: 'WorldSpanish',
};

export const AT_INTERNET_CUSTOM_PROPS: Record<string, string> = {
  referrerSite: 'referrer',
  projectId: 'pci_project_id',
  voucherCode: 'pci_voucher_code',
  pciCreationStep: 'pci_error_step',
  pciCreationErrorMessage: 'pci_error_message',
  pciCreationNumProjects: 'pci_number_of_project',
  pciCreationNumProjects3: 'pci_number_of_project',
  orderStatus: 'order_status',
  accountEmailConsent: 'account_email_consent',
  accountSmsConsent: 'account_sms_consent',
  accountPhoneType: 'account_phone_type',
  accountcreationSiretProvided: 'accountcreation_siret_provided',
};

export const TMS_SCRIPT_URL = 'https://analytics.ovh.com/ovh/ovh_manager.js';

export default {
  AT_INTERNET_CUSTOM_PROPS,
  AT_INTERNET_LEVEL2,
  AT_INTERNET_WEBSITE,
  TMS_SCRIPT_URL,
};
