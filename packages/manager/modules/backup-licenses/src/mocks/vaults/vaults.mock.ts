/**
 * Jeux de données de développement pour l'onglet « Facturation » (BKP-1225), calqués sur
 * la maquette : un vault inclus (bundle, 487 Go) et deux vaults paygo.
 * À supprimer une fois l'endpoint déployé (cf. §15 de la spec).
 *
 * Les vaults (BKP-1221/1222) réutilisent ces trois lignes — d'où l'ajout de `status` et
 * `buckets`, que la facturation ne lit pas — et ajoutent leurs propres cas limites plus bas.
 */
import { getVaultIamUrn } from '@/mocks/iam/iam.mock';
import { ResourceStatus } from '@/types/Resource.type';
import { VaultBucket, VaultResource } from '@/types/Vault.type';

/**
 * L'API sert chaque vault avec son enveloppe IAM : sans elle, les entrées du menu d'action restent
 * désactivées, faute d'URN à autoriser.
 */
const withIam = (vaults: VaultResource[]): VaultResource[] =>
  vaults.map((vault) => ({
    ...vault,
    iam: { id: `iam-${vault.id}`, urn: getVaultIamUrn(vault.id) },
  }));

const buildBucket = (overrides: Partial<VaultBucket> & Pick<VaultBucket, 'id'>): VaultBucket => ({
  name: `bucket-${overrides.id}`,
  performance: 'HIGH_PERF',
  region: 'eu-west-rbx',
  role: 'PRIMARY',
  status: 'READY',
  endPoint: `s3.${overrides.region ?? 'eu-west-rbx'}.io.cloud.ovh.net`,
  ...overrides,
});

export const mockVaults: VaultResource[] = withIam([
  {
    id: 'vault-1',
    resourceStatus: 'READY',
    currentState: {
      id: 'vault-1',
      name: 'vault-veeam-multi-region',
      resourceName: 'vault-veeam-multi-region',
      region: 'EU-WEST-PAR',
      type: 'BUNDLE',
      vaultProductLine: 'BACKUP_LICENSES',
      status: 'READY',
      vspcTenants: ['vspc-tenant-backuplicenses-01'],
      buckets: [
        buildBucket({ id: 'vault-1-b1', region: 'eu-west-rbx' }),
        buildBucket({
          id: 'vault-1-b2',
          region: 'eu-west-gra',
          role: 'REPLICA',
          performance: 'STANDARD',
        }),
      ],
    },
  },
  {
    id: 'vault-2',
    resourceStatus: 'READY',
    currentState: {
      id: 'vault-2',
      name: 'vault-veeam-paris',
      resourceName: 'vault-veeam-paris',
      region: 'EU-WEST-PAR',
      type: 'PAYGO',
      vaultProductLine: 'BACKUP_LICENSES',
      status: 'READY',
      vspcTenants: ['vspc-tenant-backuplicenses-01'],
      buckets: [buildBucket({ id: 'vault-2-b1', region: 'eu-west-par' })],
    },
  },
  {
    id: 'vault-3',
    resourceStatus: 'READY',
    currentState: {
      id: 'vault-3',
      name: 'vault-veeam-london',
      resourceName: 'vault-veeam-london',
      region: 'UK-LONDON',
      type: 'PAYGO',
      vaultProductLine: 'BACKUP_LICENSES',
      status: 'READY',
      vspcTenants: ['vspc-tenant-backuplicenses-01'],
      buckets: [buildBucket({ id: 'vault-3-b1', region: 'eu-west-lz-lon' })],
    },
  },
]);

/** Les trois lignes de la maquette BKP-1221, pour comparer l'UI mockée au design. */
export const mockVaultsFromDesign = mockVaults;

/** Servi sans enveloppe IAM : il n'y a alors aucun URN à autoriser, donc aucune action possible. */
const vaultWithoutIamEnvelope: VaultResource = {
  id: 'vault-without-iam-envelope',
  resourceStatus: 'READY',
  currentState: {
    id: 'vault-without-iam-envelope',
    name: 'vault-without-iam-envelope',
    resourceName: 'vault-without-iam-envelope',
    region: 'EU-WEST-PAR',
    type: 'PAYGO',
    vaultProductLine: 'BACKUP_LICENSES',
    status: 'READY',
    buckets: [buildBucket({ id: 'vault-without-iam-envelope-b1' })],
  },
};

/** Cas que la maquette ne montre pas — les noms disent lequel. */
export const mockEdgeCaseVaults: VaultResource[] = withIam([
  {
    id: 'vault-foreign',
    resourceStatus: 'READY',
    currentState: {
      id: 'vault-foreign',
      name: 'vault-of-backup-agent',
      resourceName: 'vault-of-backup-agent',
      region: 'EU-WEST-PAR',
      type: 'PAYGO',
      vaultProductLine: 'BACKUP_AGENT',
      status: 'READY',
      buckets: [buildBucket({ id: 'vault-foreign-b1' })],
    },
  },
  ...(
    [
      ['ERROR', 'vault-status-error'],
      ['SUSPENDED', 'vault-status-suspended'],
      ['UPDATING', 'vault-status-updating'],
      ['DELETING', 'vault-status-deleting'],
      ['OUT_OF_SYNC', 'vault-status-out-of-sync'],
      ['CREATING', 'vault-status-creating'],
    ] as [ResourceStatus, string][]
  ).map(([status, name]) => ({
    id: name,
    resourceStatus: status,
    currentState: {
      id: name,
      name,
      resourceName: name,
      region: 'EU-WEST-PAR',
      type: 'PAYGO' as const,
      vaultProductLine: 'BACKUP_LICENSES',
      status,
      buckets: [buildBucket({ id: `${name}-b1` })],
    },
  })),
  {
    id: 'vault-bundle-purchased',
    resourceStatus: 'READY',
    currentState: {
      id: 'vault-bundle-purchased',
      name: 'vault-bundle-purchased',
      resourceName: 'vault-bundle-purchased',
      region: 'EU-WEST-PAR',
      type: 'BUNDLE',
      vaultProductLine: 'BACKUP_LICENSES',
      status: 'READY',
      buckets: [buildBucket({ id: 'vault-bundle-purchased-b1' })],
    },
  },
  {
    id: 'vault-primary-suspended',
    resourceStatus: 'READY',
    currentState: {
      id: 'vault-primary-suspended',
      name: 'vault-primary-suspended',
      resourceName: 'vault-primary-suspended',
      region: 'EU-WEST-PAR',
      type: 'PAYGO',
      vaultProductLine: 'BACKUP_LICENSES',
      status: 'READY',
      buckets: [buildBucket({ id: 'vault-primary-suspended-b1', status: 'SUSPENDED' })],
    },
  },
  {
    id: 'vault-two-primaries',
    resourceStatus: 'READY',
    currentState: {
      id: 'vault-two-primaries',
      name: 'vault-two-primaries',
      resourceName: 'vault-two-primaries',
      region: 'EU-WEST-PAR',
      type: 'PAYGO',
      vaultProductLine: 'BACKUP_LICENSES',
      status: 'READY',
      buckets: [
        buildBucket({ id: '0109-b1', status: 'SUSPENDED' }),
        buildBucket({ id: '0109-b2', status: 'READY', region: 'eu-west-gra' }),
      ],
    },
  },
  {
    id: 'vault-without-bucket',
    resourceStatus: 'READY',
    currentState: {
      id: 'vault-without-bucket',
      name: 'vault-without-bucket',
      resourceName: 'vault-without-bucket',
      region: 'EU-WEST-PAR',
      type: 'PAYGO',
      vaultProductLine: 'BACKUP_LICENSES',
      status: 'READY',
      buckets: [],
    },
  },
  {
    id: 'vault-not-ready-yet',
    resourceStatus: 'UPDATING',
    currentState: {
      id: 'vault-not-ready-yet',
      name: 'vault-not-ready-yet',
      resourceName: 'vault-not-ready-yet',
      region: 'EU-WEST-PAR',
      type: 'PAYGO',
      vaultProductLine: 'BACKUP_LICENSES',
      status: 'READY',
      buckets: [buildBucket({ id: 'vault-not-ready-yet-b1' })],
    },
  },
]).concat(vaultWithoutIamEnvelope);

export const mockVaultBucketAccess = {
  accessKey: 'AKIAMOCKACCESSKEY',
  secretKey: 'wJalrXUtnFEMIMOCKSECRETKEY',
};
