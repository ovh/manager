export interface TCredit {
  text: string;
  value: number;
  currencyCode: string;
}

export type TVoucher = {
  id: number;
  bill: string | null;
  products: string | null;
  description: string;
  voucher: string;
  validity: {
    from: string | null;
    to: string | null;
  };
  total_credit: TCredit;
  available_credit: TCredit;
  used_credit: TCredit;
};
