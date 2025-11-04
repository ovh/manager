export enum OptionEnum {
  DNS_ANYCAST = 'dnsAnycast',
}

export enum PossibleStrategiesEnum {
  CANCEL_SERVICE = 'CANCEL_SERVICE',
  REACTIVATE_ENGAGEMENT = 'REACTIVATE_ENGAGEMENT',
  STOP_ENGAGEMENT_FALLBACK_DEFAULT_PRICE = 'STOP_ENGAGEMENT_FALLBACK_DEFAULT_PRICE',
  STOP_ENGAGEMENT_KEEP_PRICE = 'STOP_ENGAGEMENT_KEEP_PRICE',
}

export enum ActionsEnum {
  EARLY_RENEWAL = 'earlyRenewal',
  TERMINATE = 'terminate',
  TERMINATE_AT_ENGAGEMENT_DATE = 'terminateAtEngagementDate',
  TERMINATE_AT_EXPIRATION_DATE = 'terminateAtExpirationDate',
}

export enum StateEnum {
  ACTIVE = 'active',
  ERROR = 'error',
  RUPTURE = 'rupture',
  TERMINATED = 'terminated',
  TO_RENEW = 'toRenew',
  UNPAID = 'unpaid',
  UNRENEWED = 'unrenewed',
}

export enum CapacitiesEnum {
  CONSUMPTION = 'consumption',
  DETACH = 'detach',
  DOWNGRADE = 'downgrade',
  DYNAMIC = 'dynamic',
  INSTALLATION = 'installation',
  RENEW = 'renew',
  UPGRADE = 'upgrade',
}

export enum DefaultEndActionEnum {
  CANCEL_SERVICE = 'CANCEL_SERVICE',
  REACTIVATE_ENGAGEMENT = 'REACTIVATE_ENGAGEMENT',
  STOP_ENGAGEMENT_FALLBACK_DEFAULT_PRICE = 'STOP_ENGAGEMENT_FALLBACK_DEFAULT_PRICE',
  STOP_ENGAGEMENT_KEEP_PRICE = 'STOP_ENGAGEMENT_KEEP_PRICE',
}

export enum EngagementConfigurationTypeEnum {
  PERIODIC = 'periodic',
  UPFRONT = 'upfront',
}

export enum CurrencyCodeEnum {
  AUD = 'AUD',
  CAD = 'CAD',
  CZK = 'CZK',
  EUR = 'EUR',
  GBP = 'GBP',
  INR = 'INR',
  LTL = 'LTL',
  MAD = 'MAD',
  N_A = 'N/A',
  PLN = 'PLN',
  SGD = 'SGD',
  TND = 'TND',
  USD = 'USD',
  XOF = 'XOF',
  POINTS = 'points',
}

export enum PricingTypeEnum {
  CONSUMPTION = 'consumption',
  PURCHASE = 'purchase',
  RENTAL = 'rental',
}

export enum ModeEnum {
  AUTOMATIC = 'automatic',
  MANUAL = 'manual',
}

export enum ContactTypeEnum {
  ADMINISTRATOR = 'administrator',
  BILLING = 'billing',
  TECHNICAL = 'technical',
}

export enum ResellingProviderEnum {
  OVH_CA = 'ovh.ca',
  OVH_EU = 'ovh.eu'
}

export enum ResourceStateEnum {
  ACTIVE = 'active',
  DELETED = 'deleted',
  SUSPENDED = 'suspended',
  TO_ACTIVATE = 'toActivate',
  TO_DELETE = 'toDelete',
  TO_SUSPEND = 'toSuspend',
}