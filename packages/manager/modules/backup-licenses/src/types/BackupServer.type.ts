/**
 * Domaine de la liste des serveurs VBR (BKP-1216).
 * Les noms de champs suivent l'exemple de réponse fourni par le BE le 27/07/2026
 * (cf. §5 et §16 de la spec BKP-1216-linked-servers-list.md), et non le tableau du ticket.
 */
import { LicenseApiValue } from './Order.type';
import { CurrentTask, Resource } from './Resource.type';

/** Statut de la licence installée sur le serveur VBR. */
export enum LicenseStatus {
  CREATING = 'CREATING',
  INSTALLED = 'INSTALLED',
  EXPIRED = 'EXPIRED',
  UPDATING = 'UPDATING',
  NOT_SUPPORTED = 'NOT_SUPPORTED',
}

/**
 * Un serveur Veeam Backup & Replication enregistré + la licence qui lui est associée.
 * Tous les champs sauf `id`/`displayName` sont optionnels : un serveur en cours de
 * création peut ne pas encore avoir d'IP, de version, d'OS ni de statut de licence.
 */
export type BackupServer = {
  /** Dupliqué avec l'id de la ressource — la liste utilise celui de la ressource. */
  id: string;
  displayName: string;
  /** Notation CIDR (ex. `203.0.113.10/32`). */
  externalIps?: string[];
  /** Notation CIDR (ex. `192.168.10.2/32`). */
  privateIps?: string[];
  /** Licence effectivement installée → colonne « Licence ». */
  licenseType?: LicenseApiValue | string;
  /** Cible demandée, peut différer de `licenseType` pendant un changement de licence. */
  licenseTypeRequested?: LicenseApiValue | string;
  licenseStatus?: LicenseStatus | string | null;
  backupServerVersion?: string;
  /** Enum majuscule : `WINDOWS`, `LINUX`, … */
  osType?: string;
  /** Non affiché aujourd'hui. */
  managementAgentStatus?: string;
};

/**
 * Ligne du tableau « Linked servers ».
 * L'enveloppe expose `status` (et non `resourceStatus`), et `currentTasks` est toujours
 * renvoyé par la route de liste : on le rend obligatoire, le polling en dépend.
 * `status` est typé `string` faute d'énumération connue (cf. §11 de la spec).
 */
export type BackupServerResource = Omit<
  Resource<BackupServer>,
  'resourceStatus' | 'currentTasks'
> & {
  status: string;
  currentTasks: CurrentTask[];
};
