import { LegalForm } from '@ovh-ux/manager-config';

/**
 * Rule driving the e-invoicing billing address picker (PPF directory).
 *
 * Shape aligned with the business rules of the ticket (RG1→RG4):
 * - `visible: false`  → SIREN absent from the PPF directory, field hidden (RG1).
 * - `visible: true` + non-empty `in` → picker with the active addresses (RG2).
 * - single `in` entry / `defaultValue` set → pre-selection (RG3).
 * - `visible: true` + empty `in` → known SIREN but no active address (RG4).
 *
 * NOTE: the real backend contract may expose these as `value.in` / `default_value`.
 * The api layer normalizes the payload to this shape.
 */
export type EinvoicingRule = {
  visible: boolean;
  mandatory: boolean;
  in: string[] | null;
  defaultValue: string | null;
};

export type EinvoicingRulesParam = {
  siret: string;
  legalForm?: LegalForm;
};
