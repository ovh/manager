import * as storages from '@datatr-ux/ovhcloud-types/cloud/storage/index';

export default storages;

export interface Containers extends storages.Container {
  createdAt?: string; // ou Date si tu veux gérer ça avec des objets Date
  encryption?: storages.EncryptionAlgorithmEnum; // Remplacer 'any' par un type précis si connu
  isHighPerfStorage?: boolean;
  objects: storages.ContainerObject[]; // Remplacer 'any' par un type précis si connu
  objectsCount: number;
  objectsSize: number;
  ownerId: number;
  public?: boolean;
  s3StorageType: string;
  virtualHost: string;
}

export interface Error {
  code: string;
  message: string;
  type: string;
}

export interface StorageError {
  error: Error;
  region: string;
}

export interface Storages {
  errors: StorageError[];
  resources: Containers[];
}
