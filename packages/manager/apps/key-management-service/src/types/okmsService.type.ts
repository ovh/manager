type ServiceLifecycleCurrent = {
  creationDate: string;
};

type ServiceLifecycle = {
  current: ServiceLifecycleCurrent;
};

type ServiceBilling = {
  engagement?: string | null;
  expirationDate?: string | null;
  nextBillingDate: string;
  lifecycle: ServiceLifecycle;
};

type ServiceContact = {
  customerCode: string;
  type: string;
};

type ServiceCustomer = {
  contacts: ServiceContact[];
};

type Product = {
  name: string;
  description: string;
};

type Resource = {
  displayName: string;
  name: string;
  state: OkmsState;
  product: Product;
  resellingProvider: any;
};

export enum OkmsState {
  Active = 'active',
  Deleted = 'deleted',
  Suspended = 'suspended',
  ToActivate = 'toActivate',
  ToDelete = 'toDelete',
  ToSuspend = 'toSuspend',
}

export type KMSServiceInfos = {
  billing: ServiceBilling;
  customer: ServiceCustomer;
  resource: Resource;
};
