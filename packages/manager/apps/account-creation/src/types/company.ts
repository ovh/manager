import { Country } from '@ovh-ux/manager-config';

export type Company = {
  country: Country;
  creationDate: string;
  name: string;
  primaryCNIN: string;
  secondaryCNIN?: string;
  address?: string;
  city?: string;
};
