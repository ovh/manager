import { LicenseApiValue } from './Order.type';
import { Resource } from './Resource.type';

/**
 * Le champ de jointure vers le vault n'est pas confirmé côté API (§14 de la spec
 * BKP-1225) : il n'est donc pas nommé explicitement ici, `matchLicenseToVault` est le
 * seul point à corriger une fois le contrat connu.
 */
export type BackupLicense = {
  id: string;
  resourceName: string;
  [joinField: string]: unknown;
};

export type BackupLicenseResource = Resource<BackupLicense>;

/**
 * Corps du POST de création d'un serveur VBR supplémentaire sur un vault déjà
 * provisionné (BKP-1217). Contrat non figé (cf. spec) — calqué sur le message
 * transmis par le PO le 31/07/2026.
 */
export interface CreateBackupLicenseBody {
  displayName: string;
  licenseType: LicenseApiValue;
  backupServerExternalIp: string[];
  /** Omise si le serveur n'est pas derrière un NAT — pas d'IP privée à envoyer. */
  backupServerPrivateIp?: string[];
}

export interface CreateBackupLicenseParams {
  backupServicesId: string;
  vspcTenantId: string;
  body: CreateBackupLicenseBody;
}
