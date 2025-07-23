export type Cart = {
  cartId: string;
  description: string;
  expire: string;
  items?: Array<unknown>;
  readonly: boolean | undefined;
};

export enum PlanCode {
  CREDIT = 'credit',
  CREDIT_DEFAULT = 'credit.default',
  PROJECT = 'project',
  PROJECT_2018 = 'project.2018',
  PROJECT_DISCOVERY = 'project.discovery',
  PROJECT_LEGACY = 'project.legacy',
}

export type CartProduct = {
  planCode: PlanCode;
  productName: string;
  productType: string;
  prices: CartProductPrice[];
};

export type CartProductPrice = {
  capacities: string[];
  description: string;
  duration: string;
  interval: number;
  maximumQuantity: number;
  maximumRepeat: number;
  minimumQuantity: number;
  minimumRepeat: number;
  price: Price;
  priceInUcents: number;
  pricingMode: string;
  pricingType: string;
};

export type OrderedProduct = {
  cartId: string;
  itemId: number;
  productId: string;
  configuration: unknown[];
  duration: string;
  options: unknown[];
  prices: {
    label: string;
    price: {
      currencyCode: string;
      priceInUcents: number;
      text: string;
      value: number;
    };
  }[];
  settings: {
    planCode: string;
    pricingMode: string;
    quantity: number;
  };
};

export type CartProductOption = {
  exclusive: boolean;
  family: string;
  mandatory: boolean;
  planCode: string;
  prices: CartProductPrice[];
  productName: string;
  productType: CartProductType;
};

export enum CartProductType {
  CLOUD_SERVICE = 'cloud_service',
  DELIVERY = 'delivery',
  DEPOSIT = 'deposit',
  DOMAIN = 'domain',
  IMPLEMENTATION_SERVICES = 'implementation_services',
  SAAS_LICENSE = 'saas_license',
  SHIPPING = 'shipping',
  STORAGE = 'storage',
}

export type CartSummary = {
  orderId: number | null;
  url: string | null;
  details: CartDetail[];
  prices: {
    originalWithoutTax: Price;
    reduction: Price;
    tax: Price;
    withTax: Price;
    withoutTax: Price;
  };
  contracts: CartContract[];
  projectItem?: { voucherConfiguration?: { value: string } };
  readonly?: boolean;
};

export type CartDetail = {
  cartItemId: number;
  description: string;
  detailType: string;
  domain: string;
  quantity: number;
  reductions: unknown[];
  originalTotalPrice: Price;
  reductionTotalPrice: Price;
  totalPrice: Price;
  unitPrice: Price;
};

export type Price = {
  value: number;
  currencyCode: string;
  text: string;
};

export type CartContract = {
  name: string;
  url: string;
  content?: string;
};

export enum PaymentMean {
  FIDELITY_ACCOUNT = 'fidelityAccount',
}

export type AddOptionToCartResponse = {
  cartId: string;
  itemId: number;
  prices: {
    price: {
      value: number;
      currencyCode: string;
      priceInUcents: number;
      text: string;
    };
    label: string;
  }[];
  duration: string;
  settings: {
    cartId: string;
    pricingMode: string;
    subscription_id: number;
    planCode: string;
    quantity: number;
  };
  offerId: string | null;
  options: unknown[];
  productId: string;
};

export type CartConfiguration = {
  id: number;
  label: string;
  value: string;
};
