import { TProjectPrice } from './Project.type';

export type CreditDetailsResponse = {
  voucher: string | null;
  description: string;
  available_credit: {
    text: string;
    value: number;
  };
  validity?: {
    from: string;
    to: string;
  };
};

export type TStartupProgram = {
  amount: TProjectPrice;
  balanceDetails: {
    amount: TProjectPrice;
    balanceSubName: string;
    expiring: {
      amount: TProjectPrice;
      creationDate: string;
      expirationDate: string;
      lastUpdate: string;
      sourceObject: {
        id: string;
        name: string;
      };
    }[];
  };
  balanceName: string;
  booked: [];
  creationDate: string;
  expiring: [];
  lastUpdate: string;
  type: string;
};
