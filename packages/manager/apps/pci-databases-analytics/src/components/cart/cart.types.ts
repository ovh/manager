export type CartItem = {
  id: string;
  title: string;
  name?: string;
  details: CartItemDetail[];
  expanded: boolean;
};

export type CartItemDetail = {
  name: string;
  description?: React.ReactNode;
  price?: number;
  priceWithTax?: number;
};
