import { FormInputRegexInterface } from '@/utils';

export const formInputRegex: FormInputRegexInterface = {
  account: /^(?:[A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*)(?:(?:[.|+])(?:[A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*))*$/,
  owner: /^[A-Za-z0-9]{2,20}$/,
};
