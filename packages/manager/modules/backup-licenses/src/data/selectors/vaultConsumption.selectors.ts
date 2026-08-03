import { BACKUP_LICENSES_VAULT_PLAN_CODES } from '@/module.constants';
import { ServiceConsumption } from '@/types/Consumption.type';

/**
 * Sélection par appartenance à la liste des plan codes (bundle et paygo), et non par
 * égalité à un code unique : l'offre Backup Licenses a deux modes de facturation du
 * stockage (§3.1 de la spec BKP-1225).
 */
export const selectVaultConsumptionElement = (
  consumptions: ServiceConsumption[],
): ServiceConsumption | undefined =>
  consumptions.find((consumption) =>
    (BACKUP_LICENSES_VAULT_PLAN_CODES as readonly string[]).includes(consumption.planCode),
  );
