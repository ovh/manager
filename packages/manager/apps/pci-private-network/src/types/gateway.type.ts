export type TGateway = {
  id: string;
  model: string;
  name: string;
  region: string;
  status: string;
  interfaces: {
    id: string;
    ip: string;
    networkId: string;
    subnetId: string;
  }[];
  externalInformation: {
    ips: { ip: string; subnetId: string }[];
    networkId: string;
  };
};

export type TGatewayCatalog = {
  size: string;
  pricePerMonth: number;
  pricePerHour: number;
};
