/**
 * Jeux de données de développement pour l'onglet « Facturation » (BKP-1225), calqués sur
 * la maquette : un vault inclus (bundle, 487 Go) et deux vaults paygo.
 * À supprimer une fois l'endpoint déployé (cf. §15 de la spec).
 */
import { VaultResource } from '@/types/Vault.type';

export const mockVaults: VaultResource[] = [
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
    },
  },
];
