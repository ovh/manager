export interface TInitialOrderFreeHosting {
  contracts: {
    content: string;
    name: string;
    url: string;
  }[];
  cartId: string;
  details: {
    cartItemID: number;
  }[];
}
