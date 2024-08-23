type Price = {
  currencyCode: string;
  text: string;
  value: number;
};

export type LastOrder = {
  date: Date;
  expirationDate: Date;
  orderId: number;
  password: string;
  pdfUrl: string;
  priceWithTax: Price;
  priceWithoutTax: Price;
  retractionDate: Date;
  tax: Price;
  url: string;
};

export type LastOrderEnvelope = {
  data: {
    lastOrder: {
      data: LastOrder;
      status: string;
    };
  };
  status: string;
};
