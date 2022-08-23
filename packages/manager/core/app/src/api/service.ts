export type Service = {
  billing: {
    plan: {
      code: string;
      invoiceName: string;
    };
  };
  serviceId: number;
};

export type BareMetalServersDetails = {
  bandwidth?: Record<string, unknown>;
  gpu?: Record<string, unknown>;
  memory?: Record<string, unknown>;
  server?: Record<string, unknown>;
  storage?: {
    disks?: Record<string, unknown>[];
  };
  vrack?: Record<string, unknown>;
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
  baremetalServers?: BareMetalServersDetails;
  nutanixCluster?: NutanixClusterDetails;
  serviceId?: number;
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
