export const AT_INTERNET_LEVEL2: Record<string, string> = {
  0: '',
  56: 'Manager-Cloud',
  57: 'Manager-Dedicated',
  58: 'Manager-DedicatedServers',
  67: 'Focus',
  81: 'Manager',
  84: 'Manager-Web',
  85: 'Manager-Server',
  86: 'Manager-PublicCloud',
  87: 'Manager-Telecom',
  88: 'Manager-Hub',
  95: 'account-creation',
  98: 'Manager-HostedPrivateCloud',
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
  pciProjectMode: 'pci_project_mode',
};

export const TMS_SCRIPT_URL = 'https://analytics.ovh.com/ovh/ovh_manager.js';

export const PCI_PROJECT_MODE_VALUES: Record<string, string> = {
  DISCOVERY: 'discovery',
  FULL: 'full',
  NONE: '',
};

export default {
  AT_INTERNET_CUSTOM_PROPS,
  AT_INTERNET_LEVEL2,
  AT_INTERNET_WEBSITE,
  TMS_SCRIPT_URL,
  PCI_PROJECT_MODE_VALUES,
};
