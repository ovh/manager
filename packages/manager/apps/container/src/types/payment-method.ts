export interface IPaymentMethod {
  icon?: {
    data?: string;
    name: string;
    url?: string;
  };
  label: string;
  status: string;
  default: boolean;
  oneclick: boolean;
  lastUpdate: string;
  description: string;
  integration: string;
  paymentType: string;
  creationDate: string;
  paymentMeanId: number;
  expirationDate?: string;
  paymentSubType: string;
  paymentMethodId: number;
}
