import { SystemFormKeys, TextInputData } from '@/types/form.type';

const SID_PATTERN = /[A-Z0-9]{3}/.source;
const PWD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"@ $%&=?'*+~#\-.,;:<>_]).{8,}$/
  .source;

export const FORM_SAP_SIDS_LABEL = 'SAP SIDs';
export const SYSTEM_TEXT_INPUTS: TextInputData<SystemFormKeys>[] = [
  {
    name: 'sapSid',
    label: 'SAP SID',
    placeholder: 'S4H',
    pattern: SID_PATTERN,
  },
  {
    name: 'sapHanaSid',
    label: 'SAP HANA SID',
    placeholder: 'HDB',
    pattern: SID_PATTERN,
  },
] as const;

export const SYSTEM_PASSWORD_INPUTS: TextInputData<SystemFormKeys>[] = [
  {
    name: 'masterSapPassword',
    label: 'SAP MASTER',
    pattern: PWD_PATTERN,
    helperKey: 'system_password_sap_master_helper',
  },
  {
    name: 'masterSapHanaPassword',
    label: 'SAP HANA MASTER',
    pattern: PWD_PATTERN,
  },
  {
    name: 'sidamnPassword',
    label: 'SIDadm',
    pattern: PWD_PATTERN,
  },
  {
    name: 'systemPassword',
    label: 'SAP HANA SYSTEM',
    pattern: PWD_PATTERN,
  },
] as const;

export const SYSTEM_INITIAL_ERRORS = {
  sapSid: '',
  sapHanaSid: '',
  masterSapPassword: '',
  masterSapHanaPassword: '',
  sidamnPassword: '',
  systemPassword: '',
} as const;
