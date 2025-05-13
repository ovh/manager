export type TFloatingIp = {
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

export enum FloatingIpSelectionId {
  NEW = 'NEW',
  UNATTACHED = 'UNATTACHED',
}
