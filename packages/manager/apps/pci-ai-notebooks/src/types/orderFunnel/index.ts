import { order } from '../catalog';
import * as ai from '@/types/cloud/project/ai';
import { PublicGit } from '../cloud/project/ai/volume';

export interface AppPricing {
  price: number;
  tax: number;
}

export interface AppGlobalPricing {
  resourcePricing?: AppPricing;
  scalingPricing?: AppPricing;
  partnerLicence?: AppPricing;
}

export interface Flavor extends ai.capabilities.Flavor {
  pricing: order.publicOrder.Pricing[];
}

export interface ImagePartnerApp extends ai.capabilities.app.Image {
  pricingCpu: AppPricing;
  pricingGpu: AppPricing;
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
  publicGit?: PublicGit;
  dataStore?: {
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
  gitUrl: string;
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

export interface JobSuggestions {
  region: string;
  ressources: {
    nb: number;
    flavor: string;
  };
  image: string;
  unsecureHttp: boolean;
}

export interface AppSuggestions {
  region: string;
  ressources: {
    nb: number;
    flavor: string;
  };
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
  volumes: OrderVolumes[];
}

export interface JobOrderResult {
  region: ai.capabilities.Region;
  flavor: Flavor;
  resourcesQuantity: number;
  image: string;
  jobName: string;
  unsecureHttp: boolean;
  sshKey: string[];
  volumes: OrderVolumes[];
  dockerCommand: string[];
}

export interface AppOrderResult {
  region: ai.capabilities.Region;
  flavor: Flavor;
  resourcesQuantity: number;
  image: string;
  appName: string;
  unsecureHttp: boolean;
  volumes: OrderVolumes[];
  scaling: Scaling;
  labels: {
    [key: string]: string;
  };
  dockerCommand: string[];
}

export interface Scaling {
  autoScaling: boolean;
  replicas: number;
  averageUsageTarget: number;
  replicasMax: number;
  replicasMin: number;
  resourceType: ai.app.ScalingAutomaticStrategyResourceTypeEnum;
}
