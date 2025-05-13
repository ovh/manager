type Amount = {
  currencyCode: string;
  value: number;
  text: string;
};

export type Debt = {
  unmaturedAmount: Amount;
  active: boolean;
  dueAmount: Amount;
  pendingAmount: Amount;
  todoAmount: Amount;
};
