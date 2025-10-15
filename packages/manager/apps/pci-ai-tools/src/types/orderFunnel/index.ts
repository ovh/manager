import { ResourcesPerUnit } from '@datatr-ux/ovhcloud-types/cloud/project/ai/capabilities/flavor/ResourcesPerUnit';
import ai from '../AI';
import catalog from '../Catalog';
import quantum from '../Quantum';

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
  pricing: catalog.Pricing[];
}

export interface ImagePartnerApp extends ai.capabilities.app.Image {
  pricingCpu: AppPricing;
  pricingGpu: AppPricing;
  contract?: ai.partner.Contract;
}

export interface FrameworkWithVersion {
  framework?: string;
  version?: string;
}

export interface Qpu {
  id: string;
  name: string;
  type: string;
  default: boolean;
  description: string;
  qubits: number;
  pricing: catalog.Pricing[];
  resourcesPerUnit: ResourcesPerUnit;
}

export interface NotebookWithQpu extends ai.notebook.Notebook {
  qpuDetail?: quantum.capabilities.QPUFlavor;
}

export interface OrderLabel {
  name?: string;
  value?: string;
}

export interface OrderSshKey {
  name?: string;
  sshKey?: string;
}

export interface Containers {
  status: string;
  message: string;
  containers: string[];
}

export interface OrderVolumes {
  cache?: boolean;
  publicGit?: {
    url?: string;
  };
  dataStore?: {
    alias?: string;
    container?: string;
    type?: ai.DataStoreTypeEnum;
  };
  mountPath?: string;
  permission?: ai.VolumePermissionEnum;
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

export interface NotebookSuggestions {
  defaultRegion: string;
  suggestions: {
    resources: {
      quantity: number;
      flavorId: string;
    };
    framework: {
      id: string;
    };
    region: string;
    editor: {
      id: string;
    };
    unsecureHttp: boolean;
  }[];
}

export interface JobSuggestions {
  defaultRegion: string;
  suggestions: {
    resources: {
      quantity: number;
      flavorId: string;
    };
    presetImage: string;
    region: string;
    unsecureHttp: boolean;
  }[];
}

export interface AppSuggestions {
  defaultRegion: string;
  suggestions: {
    region: string;
    resources: {
      quantity: number;
      flavorId: string;
    };
    unsecureHttp: boolean;
  }[];
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
  QPUFlavor?: Qpu;
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
  version: string;
  appName: string;
  unsecureHttp: boolean;
  volumes: OrderVolumes[];
  scaling: Scaling;
  httpPort: number;
  labels: {
    [key: string]: string;
  };
  dockerCommand: string[];
  probe: {
    path?: string;
    port?: number;
  };
}

export interface Scaling {
  autoScaling?: boolean;
  replicas?: number;
  averageUsageTarget?: number;
  replicasMax?: number;
  replicasMin?: number;
  resourceType?: ai.app.ScalingAutomaticStrategyResourceTypeEnum;
}
