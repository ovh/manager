export interface Icon {
  data: string;
  name: string;
  url: string;
}

export interface Payment {
  creationDate: string;
  description: string;
  id: number;
  label: string;
  icon: Icon;
  state: string;
  defaultPaymentMean: boolean;
}

export interface FormattedPaymentType {
  id: string;
  isAvailable: boolean;
}

export interface PaymentTypes {
  [key: string]: boolean;
}
