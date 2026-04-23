import { Country } from '@ovh-ux/manager-config';

export type Company = {
  address?: string;
  city?: string;
  country: Country;
  creationDate: string;
  name?: string;
  zipCode?: string;
  primaryCNIN: string; // SIREN
  secondaryCNIN: string; // SIRET
  vatID: string;
};
