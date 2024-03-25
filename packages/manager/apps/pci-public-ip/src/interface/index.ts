export interface Instance {
  id: string;
  name: string;
}

export interface AssociatedEntity {
  gatewayId: string;
  id: string;
  ip: string;
  type: string;
  name: string;
}

export interface FloatingIP {
  associatedEntity: AssociatedEntity | null;
  id: string;
  ip: string;
  networkId: string;
  region: string;
  status: string;
}
