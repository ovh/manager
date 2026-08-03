/**
 * Projection de `backup.tenant.vault.CurrentState` et de ses membres (contrat v2 `backupServices`).
 * Les types ne sont pas importés de `@ovh-ux/backup-agent` : ce module ne peut pas en dépendre
 * (dépendance fantôme, cf. §5 de la spec BKP-1225).
 */
import { Resource, ResourceStatus } from './Resource.type';

export type VaultBillingType = 'BUNDLE' | 'PAYGO';

export type VaultProductLine = 'BACKUP_AGENT' | 'BACKUP_LICENSES';

export type BucketRole = 'PRIMARY' | 'REPLICA';

export type BucketPerformance = 'HIGH_PERF' | 'STANDARD';

export type VaultBucket = {
  id: string;
  name: string;
  performance: BucketPerformance;
  region: string;
  role: BucketRole;
  status: ResourceStatus;
};

export type Vault = {
  id: string;
  name: string;
  resourceName: string;
  region: string;
  type: VaultBillingType;
  /** Quota inclus d'un vault BUNDLE ; null pour PAYGO, BACKUP_AGENT ou hors sujet. */
  includedSoftQuotaGb?: number | null;
  /** Nullable au contrat, tant que les vaults existants ne sont pas rétro-remplis. */
  vaultProductLine?: VaultProductLine | null;
  /** Ajoutés pour les vaults (BKP-1221/1222) : la facturation n'en a pas besoin. */
  status?: ResourceStatus;
  buckets?: VaultBucket[];
  vspcTenants?: string[];
};

export type VaultResource = Resource<Vault> & {
  iam?: { id: string; urn: string; displayName?: string; tags?: Record<string, string> };
};

/**
 * `backup.tenant.vault.bucket.Credentials` : la réponse porte elle-même l'endpoint S3 et le code
 * de région court (`backup.RegionCodeEnum`), qui n'est pas le `common.RegionEnum` du bucket.
 */
export type VaultBucketAccess = {
  accessKey: string;
  bucketName: string;
  endpoint: string;
  regionCode: string;
  secretKey: string;
};

export type VaultOrder = {
  name: string;
  /** Code machine de la région, tel que `GET /location` le nomme (`eu-west-par`). */
  region: string;
};
