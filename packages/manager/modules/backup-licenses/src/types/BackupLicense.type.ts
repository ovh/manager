import { Resource } from './Resource.type';

export type BackupLicense = {
  id: string;
  resourceName: string;
};

export type BackupLicenseResource = Resource<BackupLicense>;
