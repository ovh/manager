import { useQuery } from '@tanstack/react-query';
import { LegalForm } from '@ovh-ux/manager-config';
import { getEinvoicingRules } from '@/data/api/einvoicing';

const SIRET_LENGTH = 14;

/**
 * Fetch the PPF e-invoicing billing address rule for the entered SIRET.
 *
 * Only enabled once a full 14-digit SIRET is available and the caller allows it
 * (FR B2B/B2G). The rule drives the address picker (RG1→RG4); `refetch` is used
 * to re-run the rules after a 400 at save time (RG6).
 */
export const useEinvoicingRules = (
  siret: string | undefined,
  legalForm: LegalForm | undefined,
  enabled = true,
) => {
  const isSiretComplete =
    !!siret && /^\d{14}$/.test(siret) && siret.length === SIRET_LENGTH;

  return useQuery({
    queryKey: ['einvoicing-rules', `siret=${siret}`, `legalform=${legalForm}`],
    queryFn: () => getEinvoicingRules({ siret: siret as string, legalForm }),
    enabled: enabled && isSiretComplete,
    placeholderData: (prev) => prev,
  });
};
