/**
 * Domaine des vaults Backup Licenses, côté facturation (BKP-1225).
 * Copie réduite du type de `@ovh-ux/backup-agent` : ce module ne peut pas l'importer
 * (dépendance fantôme, cf. §5 de la spec BKP-1225).
 */
import { Resource, ResourceStatus } from './Resource.type';

export type VaultBillingType = 'BUNDLE' | 'PAYGO';

export type BucketRole = 'PRIMARY' | 'REPLICA';

export type BucketPerformance = 'HIGH_PERF' | 'STANDARD';

export type VaultBucket = {
  id: string;
  name: string;
  performance: BucketPerformance;
  region: string;
  role: BucketRole;
  status: ResourceStatus;
  /** Champ supposé, absent du schéma v2 publié (2026-06-16). */
  endPoint?: string;
};

export type Vault = {
  id: string;
  name: string;
  resourceName: string;
  region: string;
  type: VaultBillingType;
  /** Champ attendu par le ticket, absent de tout contrat connu — cf. §14 de la spec. */
  vaultProductLine?: string;
  /** Ajoutés pour les vaults (BKP-1221/1222) : la facturation n'en a pas besoin. */
  status?: ResourceStatus;
  buckets?: VaultBucket[];
  vspcTenants?: string[];
};

export type VaultResource = Resource<Vault> & {
  iam?: { id: string; urn: string; displayName?: string; tags?: Record<string, string> };
};

export type VaultBucketAccess = {
  accessKey: string;
  secretKey: string;
};
