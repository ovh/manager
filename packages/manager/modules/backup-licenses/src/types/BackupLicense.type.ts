import { Resource } from './Resource.type';

/**
 * Licence Backup Licenses, résolue pour son prix (§3.2 de la spec BKP-1225).
 * Le champ de jointure vers le vault n'est pas confirmé côté API (cf. §14) : il n'est
 * donc pas nommé dans ce type, `matchLicenseToVault` est le seul point à corriger
 * une fois le contrat connu.
 */
export type BackupLicense = {
  id: string;
  resourceName: string;
  [joinField: string]: unknown;
};

export type BackupLicenseResource = Resource<BackupLicense>;
