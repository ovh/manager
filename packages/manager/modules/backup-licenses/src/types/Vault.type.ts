/**
 * Domaine des vaults Backup Licenses, côté facturation (BKP-1225).
 * Copie réduite du type de `@ovh-ux/backup-agent` : ce module ne peut pas l'importer
 * (dépendance fantôme, cf. §5 de la spec BKP-1225).
 */
import { Resource } from './Resource.type';

export type VaultBillingType = 'BUNDLE' | 'PAYGO';

export type Vault = {
  id: string;
  name: string;
  resourceName: string;
  region: string;
  type: VaultBillingType;
  /** Champ attendu par le ticket, absent de tout contrat connu — cf. §14 de la spec. */
  vaultProductLine?: string;
};

export type VaultResource = Resource<Vault>;
