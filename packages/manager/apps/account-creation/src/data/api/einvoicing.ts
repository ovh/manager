import { v6 } from '@ovh-ux/manager-core-api';
import { EinvoicingRule, EinvoicingRulesParam } from '@/types/einvoicing';

/**
 * One rule entry of the account rules endpoint. The e-invoicing entry is the one
 * whose field name is `einvoicing_billing_address`. Field/shape are tolerated in
 * both the raw Furry (snake_case) and apiv6-normalized (camelCase) conventions.
 */
type AccountRuleApiEntry = {
  field_name?: string;
  fieldName?: string;
  visible?: boolean;
  mandatory?: boolean;
  value?: { in?: string[] | null } | null;
  in?: string[] | null;
  default_value?: string | null;
  defaultValue?: string | null;
};

// apiv6 may expose the field name camelCased, so match both spellings.
const EINVOICING_BILLING_ADDRESS_FIELDS = [
  'einvoicing_billing_address',
  'einvoicingBillingAddress',
];

/**
 * Get the e-invoicing billing address rule for a given SIRET.
 *
 * Reuses the existing account rules endpoint (POST /newAccount/rules — the apiv6
 * face of the Furry account-rules mechanism; the contract's Furry name is
 * /meta/account/rules), passing the 14-digit SIRET so the response carries the
 * `einvoicing_billing_address` entry driving the picker (RG1→RG4).
 */
export const getEinvoicingRules = async ({
  siret,
  legalForm,
}: EinvoicingRulesParam): Promise<EinvoicingRule> => {
  const { data } = await v6.post<AccountRuleApiEntry[]>('/newAccount/rules', {
    country: 'FR',
    legalform: legalForm,
    companyNationalIdentificationNumber: siret,
    action: 'update',
  });

  // The endpoint returns the full rules array — pick the e-invoicing entry.
  const entry = data?.find(
    (rule) =>
      EINVOICING_BILLING_ADDRESS_FIELDS.includes(rule.field_name ?? '') ||
      EINVOICING_BILLING_ADDRESS_FIELDS.includes(rule.fieldName ?? ''),
  );

  return {
    // The real /newAccount/rules omits `visible`: the entry's PRESENCE means the
    // field applies (in:[] empty / in:[x] single / in:[x,y] many) — still honor
    // an explicit visible:false if ever sent.
    visible: Boolean(entry) && entry?.visible !== false,
    mandatory: Boolean(entry?.mandatory),
    in: entry?.value?.in ?? entry?.in ?? null,
    defaultValue: entry?.default_value ?? entry?.defaultValue ?? null,
  };
};
