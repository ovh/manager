import { LegalForm } from '@ovh-ux/manager-config';
import { useRules } from '@/data/hooks/useRules';

const SIRET_REGEX = /^\d{14}$/;

/**
 * `einvoicingBillingAddress` entry of /newAccount/rules for the entered SIRET
 * (absent when the PPF directory doesn't know it). A separate query so SIRET
 * typing doesn't re-fetch the whole form's rules.
 */
export const useEinvoicingRules = (
  siret: string | undefined,
  legalForm: LegalForm | undefined,
  enabled = true,
) =>
  useRules(
    {
      country: 'FR',
      legalform: legalForm,
      companyNationalIdentificationNumber: siret,
      action: 'update',
    },
    ['einvoicingBillingAddress'],
    enabled && !!siret && SIRET_REGEX.test(siret),
  );
