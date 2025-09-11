import { Country, LegalForm } from '@ovh-ux/manager-config';

export const shouldAccessCompanySearch = (
  country?: Country,
  legalForm?: LegalForm,
) => country === 'FR' && legalForm && legalForm !== 'individual';
