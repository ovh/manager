import { SystemForm, TextInputData } from '@/types/form.type';
import { FORM_LABELS } from '@/constants/form.constants';
import { LABELS } from '@/utils/label.constants';

// A SAP SID consists of three uppercase alphanumeric characters and starts with a letter.
const SAP_SID_PATTERN = /^[A-Z][A-Z0-9]{2}$/.source;

export const SYSTEM_TEXT_INPUTS: TextInputData<keyof SystemForm>[] = [
  {
    name: 'sapSid',
    label: LABELS.SAP_SID,
    validator: { isRequired: true, pattern: SAP_SID_PATTERN, maxlength: 3 },
  },
  {
    name: 'sapHanaSid',
    label: LABELS.SAP_HANA_SID,
    validator: { isRequired: true, pattern: SAP_SID_PATTERN, maxlength: 3 },
  },
] as const;

export const SYSTEM_PASSWORD_INPUTS: TextInputData<keyof SystemForm>[] = [
  {
    name: 'masterSapPassword',
    label: FORM_LABELS.masterSapPassword,
    helperKey: 'system_password_sap_master_helper',
    validator: { isRequired: true },
  },
  {
    name: 'masterSapHanaPassword',
    label: FORM_LABELS.masterSapHanaPassword,
    validator: { isRequired: true },
  },
  {
    name: 'sidadmPassword',
    label: FORM_LABELS.sidadmPassword,
    validator: { isRequired: true },
  },
  {
    name: 'systemPassword',
    label: FORM_LABELS.systemPassword,
    validator: { isRequired: true },
  },
] as const;
