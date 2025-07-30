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
