import { ApiAggregateEnvelope, ApiEnvelope } from '@/types/apiEnvelope.type';

type Service = {
  propertyId: string;
  resource: {
    displayName: string;
    name: string;
    product?: {
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
  universe: Record<string, string>;
  url: string;
};

type ServiceList = ApiAggregateEnvelope<Service[]>;

type Products = Record<string, ServiceList>;

export type ProductList = ApiAggregateEnvelope<Products>;

type ServicesData = {
  services: ApiEnvelope<ProductList>;
};

export type ServicesEnvelope = ApiEnvelope<ServicesData>;

export type HubProduct = {
  data: Service[];
  count: number;
  type: string;
  formattedType: string;
  application: string;
  hash: string;
};
