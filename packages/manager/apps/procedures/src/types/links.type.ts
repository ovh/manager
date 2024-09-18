import { Subsidiary } from '@/types/user.type';

type CanadianPolicyLinks = {
  fr_CA: string;
  en_CA: string;
};

export type PolicyLinks = {
  [key in Subsidiary | 'DEFAULT']: key extends 'CA'
    ? CanadianPolicyLinks
    : string;
};
