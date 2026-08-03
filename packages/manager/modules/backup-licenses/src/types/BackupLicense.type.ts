import { Resource } from './Resource.type';
import { LicenseApiValue } from './Order.type';

export type BackupLicense = {
  id: string;
  resourceName: string;
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
