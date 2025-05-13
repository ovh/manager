import { Subsidiary } from '@/types/user.type';

export type CanadianPolicyLinks = {
  fr: string;
  en: string;
};

export type PolicyLinks = {
  [key in Subsidiary | 'DEFAULT']: key extends 'CA'
    ? CanadianPolicyLinks
    : string;
};
