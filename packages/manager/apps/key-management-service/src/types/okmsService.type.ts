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

export type KMSServiceInfos = {
  billing: ServiceBilling;
  customer: ServiceCustomer;
};
