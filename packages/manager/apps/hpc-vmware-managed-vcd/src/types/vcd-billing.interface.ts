interface IBilling {
  engagement?: string | null;
  expirationDate?: string | null;
  nextBillingDate: string;
  lifecycle?: {
    creationDate: string;
  };
}

interface IContact {
  customerCode: string;
  interface: string;
}

interface ICustomer {
  contacts: IContact[];
}

export interface IBillingService {
  billing: IBilling;
  customer: ICustomer;
}
