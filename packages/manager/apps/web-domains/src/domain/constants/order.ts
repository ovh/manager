export const DEFAULT_DNS_CONFIGURATION = (zoneName: string) => [
  { label: 'zone', value: zoneName },
  { label: 'template', value: 'minimized' },
];

export const ANYCAST_ORDER_CONSTANT = {
  DURATION: 'P1Y',
  PRODUCT_ID: 'dns',
  QUANTITY: 1,
  PRICING_MODE: 'default',
  ANYCAST_PLAN_CODE: 'anycast',
  DNSSEC_CONFIGURATION: { label: 'dnssec', value: 'true' },
};
