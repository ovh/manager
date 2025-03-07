export type FloatingIp = {
  id: string;
  ip: string;
  networkId: string;
  status: string;
  associatedEntity: null | {
    id: string;
    type: string;
    ip: string;
  };
};
