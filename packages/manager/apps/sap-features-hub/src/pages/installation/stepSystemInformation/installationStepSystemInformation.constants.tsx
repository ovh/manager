import { SystemFormKeys, TextInputData } from '@/types/form.type';

// Un SID SAP comporte 3 caractères alphanumériques en majuscule et commence par une lettre.
const SAP_SID_PATTERN = /^[A-Z][A-Z0-9]{2}$/.source;

export const FORM_SAP_SIDS_LABEL = 'SAP SIDs';
export const SYSTEM_TEXT_INPUTS: TextInputData<SystemFormKeys>[] = [
  {
    name: 'sapSid',
    label: 'SAP SID',
    placeholder: 'S4H',
    pattern: SAP_SID_PATTERN,
    maxlength: 3,
    isRequired: true,
  },
  {
    name: 'sapHanaSid',
    label: 'SAP HANA SID',
    placeholder: 'HDB',
    pattern: SAP_SID_PATTERN,
    maxlength: 3,
    isRequired: true,
  },
] as const;

export const SYSTEM_PASSWORD_INPUTS: TextInputData<SystemFormKeys>[] = [
  {
    name: 'masterSapPassword',
    label: 'SAP MASTER',
    helperKey: 'system_password_sap_master_helper',
    isRequired: true,
  },
  {
    name: 'masterSapHanaPassword',
    label: 'SAP HANA MASTER',
    isRequired: true,
  },
  {
    name: 'sidamnPassword',
    label: 'SIDadm',
    isRequired: true,
  },
  {
    name: 'systemPassword',
    label: 'SAP HANA SYSTEM',
    isRequired: true,
  },
] as const;
