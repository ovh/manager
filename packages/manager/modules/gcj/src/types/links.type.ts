import { OvhSubsidiary } from '@ovh-ux/manager-react-components';

export type CanadianPolicyLinks = {
  fr: string;
  en: string;
};

export type PolicyLinks = {
  [key in OvhSubsidiary | 'LTE']: key extends 'CA' ? CanadianPolicyLinks : string;
};
