import { Country, LegalForm } from '@ovh-ux/manager-config';
import { useRules } from '@/data/hooks/useRules';

/**
 * `einvoicingBillingAddress` entry of /newAccount/rules for the entered SIRET
 * (absent when the PPF directory doesn't know it). A separate query so SIRET
 * typing doesn't re-fetch the whole form's rules. The caller gates `enabled`
 * on the country (FR_COUNTRIES, DROM included) and on SIRET validity against
 * the rules regularExpression.
 */
export const useEinvoicingRules = (
  siret: string | undefined,
  legalForm: LegalForm | undefined,
  country: string | undefined,
  enabled = true,
) =>
  useRules(
    {
      country: country as Country | undefined,
      legalform: legalForm,
      companyNationalIdentificationNumber: siret,
      action: 'update',
    },
    ['einvoicingBillingAddress'],
    enabled && !!siret && !!country,
  );
