import { LicenseApiValue } from './Order.type';
import { Resource } from './Resource.type';

export type BackupLicense = {
  id: string;
};

export type BackupLicenseResource = Resource<BackupLicense>;

/**
 * Corps du POST de création d'un serveur VBR supplémentaire sur un vault déjà
 * provisionné (BKP-1217), directement sur `.../backupLicenses/{id}/backupServer`
 * (contrat confirmé par le PO le 2026-08-21, plus de panier Agora pour ce flux).
 */
export interface CreateBackupLicenseBody {
  displayName: string;
  licenseType: LicenseApiValue;
  externalIps: string[];
  privateIps: string[];
}
