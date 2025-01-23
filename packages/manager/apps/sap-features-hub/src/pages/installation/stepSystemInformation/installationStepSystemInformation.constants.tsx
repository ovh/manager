import { SystemForm, TextInputData } from '@/types/form.type';

// Un SID SAP comporte 3 caractères alphanumériques en majuscule et commence par une lettre.
const SAP_SID_PATTERN = /^[A-Z][A-Z0-9]{2}$/.source;

export const FORM_SAP_SIDS_LABEL = 'SAP SIDs';
export const SYSTEM_TEXT_INPUTS: TextInputData<keyof SystemForm>[] = [
  {
    name: 'sapSid',
    label: 'SAP SID',
    validator: { isRequired: true, pattern: SAP_SID_PATTERN, maxlength: 3 },
  },
  {
    name: 'sapHanaSid',
    label: 'SAP HANA SID',
    validator: { isRequired: true, pattern: SAP_SID_PATTERN, maxlength: 3 },
  },
] as const;

export const SYSTEM_PASSWORD_INPUTS: TextInputData<keyof SystemForm>[] = [
  {
    name: 'masterSapPassword',
    label: 'SAP MASTER',
    helperKey: 'system_password_sap_master_helper',
    validator: { isRequired: true },
  },
  {
    name: 'masterSapHanaPassword',
    label: 'SAP HANA MASTER',
    validator: { isRequired: true },
  },
  {
    name: 'sidamnPassword',
    label: 'SIDadm',
    validator: { isRequired: true },
  },
  {
    name: 'systemPassword',
    label: 'SAP HANA SYSTEM',
    validator: { isRequired: true },
  },
] as const;
