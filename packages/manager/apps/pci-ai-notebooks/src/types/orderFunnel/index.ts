import { order } from '../catalog';
import * as ai from '@/types/cloud/project/ai';

export interface Flavor extends ai.capabilities.Flavor {
  pricing: order.publicOrder.Pricing[];
}

export interface FrameworkWithVersion {
  framework: string;
  version: string;
}

export interface OrderSshKey {
  name: string;
  sshKey: string;
}

export interface Containers {
  status: string;
  message: string;
  containers: string[];
}

export interface OrderVolumes {
  cache: boolean;
  dataStore: {
    alias: string;
    container: string;
    type: ai.DataStoreTypeEnum;
  };
  mountPath: string;
  permission: ai.VolumePermissionEnum;
}

export interface FormVolumes {
  container: string;
  gitBranch: string;
  mountDirectory: string;
  permission: ai.VolumePermissionEnum;
  cache: boolean;
}

export enum PrivacyEnum {
  'private' = 'private',
  'public' = 'public',
}

export interface Suggestions {
  region: string;
  ressources: {
    nb: number;
    flavor: string;
  };
  framework: {
    id: string;
    version: string;
  };
  editorId: string;
  unsecureHttp: boolean;
}

export interface NotebookOrderResult {
  region: ai.capabilities.Region;
  flavor: Flavor;
  resourcesQuantity: number;
  framework: ai.capabilities.notebook.Framework;
  version: string;
  editor: ai.capabilities.notebook.Editor;
  notebookName: string;
  unsecureHttp: boolean;
  labels: {
    [key: string]: string;
  };
  sshKey: string[];
  volumes: any[];
}
