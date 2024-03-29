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

export interface FailoverIP {
  associatedEntity: Instance | null;
  block: string;
  continentCode: string;
  geoloc: string;
  id: string;
  ip: string;
  progress: number;
  routedTo: string;
  status: string;
  subType: string;
}

export interface ResponseAPIError {
  message: string;
  stack: string;
  name: string;
  code: string;
  response?: {
    headers?: {
      [key: string]: string;
      'x-ovh-queryid': string;
    };
    data?: {
      message?: string;
    };
  };
}

export interface ActionProps {
  ipId: string;
  projectId: string;
}

export interface TerminateIPProps {
  projectId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
}
