import { SupportLevelEnum } from './support';

export type Service = {
  billing: {
    engagement?: {
      endRule?: {
        possibleStrategies: string[];
        strategy: string;
      }
    },
    lifecycle: {
      current: {
        creationDate: string;
      };
    };
    nextBillingDate: string;
    plan: {
      code: string;
      invoiceName: string;
    };
  };
  route: {
    url: string;
  };
  serviceId: number;
};

export enum BareMetalServersStorageDiskUsageEnum {
  CACHE = 'cache',
  DATA = 'data',
  OS = 'os',
}

export enum BareMetalServersServerServicesSecureComputingTechnologyEnum {
  AMD_INFINITY = 'AMDInfinity',
  INTEL_SGX = 'IntelSGX',
}

export type BareMetalServersServerDetails = {
  cpu: {
    boost: number;
    brand: string;
    cores: number;
    frequency: number;
    model: string;
    number: number;
    score: number;
    threads: number;
  };
  extensionCard: {
    model: string;
    size: string;
  };
  frame: {
    dualPowerSupply: boolean;
    maxNbDisks?: number;
    model: string;
    size: string;
  };
  network: {
    capacity: number;
    interfaces: number;
  };
  range: string;
  services: {
    antiddos: string;
    includedBackup: number;
    ipmiAvailable: boolean;
    ipv4RangeIncluded?: string;
    ipv6RangeIncluded?: string;
    kvmipAvailable: boolean;
    olaAvailable: boolean;
    secureComputingTechnology?: BareMetalServersServerServicesSecureComputingTechnologyEnum;
    sla: number;
    supportLevel?: SupportLevelEnum;
  };
  useCase?: string;
};

export type BareMetalServersStorageDiskDetails = {
  capacity: number;
  dwpd?: number;
  interface: string;
  latency?: number;
  number: number;
  read?: number;
  specs: string;
  technology: string;
  usage: BareMetalServersStorageDiskUsageEnum;
  write?: number;
};

export type BareMetalServersStorageDetails = {
  disks?: BareMetalServersStorageDiskDetails[];
  raid: string;
};

export type BareMetalServerDetailsKeys =
  | 'bandwidth'
  | 'gpu'
  | 'memory'
  | 'server'
  | 'storage'
  | 'vrack';

export type BareMetalServerDetails = {
  bandwidth?: {
    aggregation?: {
      upTo: number;
    };
    burst: number;
    guaranteed: boolean;
    level: number;
    limit: number;
  };
  gpu?: {
    brand: string;
    memory: {
      size: number;
    };
    model: string;
    number: number;
  };
  memory?: {
    ecc: boolean;
    frequency: number;
    ramType: string;
    size: number;
  };
  server?: BareMetalServersServerDetails;
  storage?: BareMetalServersStorageDetails;
  vrack?: {
    aggregation?: {
      upTo: number;
    };
    burst: number;
    guaranteed: boolean;
    level: number;
    limit: number;
  };
};

export type NutanixClusterLicenseFeatureDetails = {
  name: string;
  value: string;
};

export type NutanixClusterLicenseDetails = {
  distribution: string;
  edition: string;
  features: NutanixClusterLicenseFeatureDetails[];
};

export type NutanixClusterDetails = {
  cluster?: Record<string, unknown>;
  features?: Record<string, unknown>;
  license?: Record<string, unknown>;
  service?: Record<string, unknown>;
};

export type TechnicalDetails = {
  baremetalServers?: BareMetalServerDetails;
  nutanixCluster?: NutanixClusterDetails;
};

export type GenericProductDefinition = {
  planCode: string;
};

export async function getServiceDetails(serviceId: number): Promise<Service> {
  const response = await fetch(`/engine/apiv6/services/${serviceId}`);
  return response.json();
}

export async function getServiceOptions(serviceId: number): Promise<Service[]> {
  const response = await fetch(`/engine/apiv6/services/${serviceId}/options`);
  return response.json();
}

export async function getHardwareInfo(
  serviceId: number,
): Promise<TechnicalDetails> {
  const response = await fetch(
    `/engine/apiv6/services/${serviceId}/technicalDetails`,
  );
  return {
    ...(await response.json()),
    serviceId,
  };
}

export async function getServiceUpgrade(
  serviceId: number,
): Promise<GenericProductDefinition[]> {
  const response = await fetch(`/engine/apiv6/services/${serviceId}/upgrade`);
  return response.json();
}

export default Service;
