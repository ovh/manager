type Service = {
  propertyId: string;
  resource: {
    displayName: string;
    name: string;
    product: {
      description: string;
      name: string;
    };
    resellingProvider: 'ovh.ca' | 'ovh.eu' | null;
    state: string;
  };
  route: {
    path: string;
  };
  serviceId: number;
  serviceType?: string;
  universe: string[];
  url: string;
};

type ServiceTypeItem = {
  count: number;
  data: Service[];
};

export type Services = {
  count: number;
  data: Record<string, ServiceTypeItem[]>;
};

export type ServicesEnvelope = {
  data: {
    services: {
      data: Services;
      status: string;
    };
  };
  status: string;
};
