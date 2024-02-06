export interface Credit {
  text: string;
  value: number;
  currencyCode: string;
}

export type Voucher = {
  id: number;
  bill: string | null;
  products: string | null;
  description: string;
  voucher: string;
  validity: {
    from: string | null;
    to: string | null;
  };
  total_credit: Credit;
  available_credit: Credit;
  used_credit: Credit;
};
