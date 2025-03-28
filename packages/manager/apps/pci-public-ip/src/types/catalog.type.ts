export type TFailoverIpCatalog = {
  plans: {
    planCode: string;
    invoiceName: string;
    details: {
      pricings: {
        default: {
          price: {
            currencyCode: string;
            text: string;
            value: number;
          };
        }[];
      };
    };
  }[];
};
