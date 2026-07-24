import { v6 } from '@ovh-ux/manager-core-api';
import { EinvoicingRule, EinvoicingRulesParam } from '@/types/einvoicing';

/** Raw response of the PPF rules endpoint (normalized to `EinvoicingRule`). */
type EinvoicingRuleApiResponse = {
  visible: boolean;
  mandatory: boolean;
  value?: { in?: string[] | null } | null;
  default_value?: string | null;
};

/**
 * Get the e-invoicing billing address rule for a given SIRET (PPF directory).
 *
 * Ticket contract: POST /meta/account/rules?action=update with country FR, the
 * account legal form and the 14-digit SIRET; the response drives the address
 * picker (RG1→RG4) via `visible`, `value.in`, `default_value`, `mandatory`.
 *
 * TODO(back): confirm the exact route/base once the PPF backend is in prod.
 */
export const getEinvoicingRules = async ({
  siret,
  legalForm,
}: EinvoicingRulesParam): Promise<EinvoicingRule> => {
  const { data } = await v6.post<EinvoicingRuleApiResponse>(
    '/meta/account/rules',
    {
      country: 'FR',
      legal_form: legalForm,
      company_national_identification_number: siret,
    },
    { params: { action: 'update' } },
  );

  return {
    visible: Boolean(data.visible),
    mandatory: Boolean(data.mandatory),
    in: data.value?.in ?? null,
    defaultValue: data.default_value ?? null,
  };
};
