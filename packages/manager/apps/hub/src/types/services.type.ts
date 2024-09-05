import { ApiAggregateEnvelope, ApiEnvelope } from '@/types/apiEnvelope.type';

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

type ServiceTypeItem = ApiAggregateEnvelope<Service[]>;

type ServicesListByType = Record<string, ServiceTypeItem[]>;

export type Services = ApiAggregateEnvelope<ServicesListByType>;

type ServicesData = {
  services: ApiEnvelope<Services>;
};

export type ServicesEnvelope = ApiEnvelope<ServicesData>;
