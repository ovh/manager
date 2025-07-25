type TAmount = {
  currencyCode: string;
  value: number;
  text: string;
};

export type TStartupProgram = {
  amount: TAmount;
  balanceDetails: {
    amount: TAmount;
    balanceSubName: string;
    expiring: {
      amount: TAmount;
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
