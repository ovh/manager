import { SystemForm, TextInputData } from '@/types/form.type';
import { FORM_LABELS } from '@/constants/form.constants';
import { LABELS } from '@/utils/label.constants';

type SapHanaPasswordInputs = Array<
  TextInputData<keyof SystemForm> & {
    passwordType: 'sap' | 'sapHana';
  }
>;

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

export const SYSTEM_PASSWORD_INPUTS: SapHanaPasswordInputs = [
  {
    name: 'masterSapPassword',
    label: FORM_LABELS.masterSapPassword,
    helperKey: 'system_password_sap_master_helper',
    validator: { isRequired: true },
    passwordType: 'sap',
  },
  {
    name: 'masterSapHanaPassword',
    label: FORM_LABELS.masterSapHanaPassword,
    validator: { isRequired: true },
    passwordType: 'sapHana',
  },
  {
    name: 'sidadmPassword',
    label: FORM_LABELS.sidadmPassword,
    validator: { isRequired: true },
    passwordType: 'sap',
  },
  {
    name: 'systemPassword',
    label: FORM_LABELS.systemPassword,
    validator: { isRequired: true },
    passwordType: 'sapHana',
  },
] as const;
