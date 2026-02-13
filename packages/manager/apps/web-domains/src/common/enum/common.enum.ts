export enum ServiceRoutes {
  Domain = '/domain',
  AllDom = '/allDom',
  DomainReseller = '/domain/reseller',
}

export enum ServiceInfoContactEnum {
  Administrator = 'administrator',
  Technical = 'technical',
  Billing = 'billing',
}

export enum ServiceInfoUpdateEnum {
  Empty = 'empty',
  TerminateAtEngagementDate = 'terminateAtEngagementDate',
  TerminateAtExpirationDate = 'terminateAtExpirationDate',
}
export enum ServiceInfoRenewModeEnum {
  Automatic = 'automatic',
  Manual = 'manual',
}
export enum LifecycleCapacitiesEnum {
  EarlyRenewal = 'earlyRenewal',
  Terminate = 'terminate',
  AutoRenewInProgress = 'autorenewInProgress',
  DeleteAtExpiration = 'deleteAtExpiration',
  TerminateAtEngagementDate = 'terminateAtEngagementDate',
  TerminateAtExpirationDate = 'terminateAtExpirationDate',
}

export enum BillingCapacitiesEnum {
  Consumption = 'consumption',
  Detach = 'detach',
  Downgrade = 'downgrade',
  Dynamic = 'dynamic',
  Installation = 'installation',
  Renew = 'renew',
  Upgrade = 'upgrade',
}

export enum DefaultEndActionEnum {
  CANCEL_SERVICE = 'CANCEL_SERVICE',
  REACTIVATE_ENGAGEMENT = 'REACTIVATE_ENGAGEMENT',
  STOP_ENGAGEMENT_FALLBACK_DEFAULT_PRICE = 'STOP_ENGAGEMENT_FALLBACK_DEFAULT_PRICE',
  STOP_ENGAGEMENT_KEEP_PRICE = 'STOP_ENGAGEMENT_KEEP_PRICE',
}

export enum BillingTypeEnum {
  Periodic = 'periodic',
  UpFront = 'upfront',
}

export enum PrincingTypeEnum {
  Consumption = 'consumption',
  Purchase = 'purchase',
  Rental = 'rental',
}

export enum LegalFormEnum {
  Administration = 'administration',
  Association = 'association',
  Corporation = 'corporation',
  Individual = 'individual',
  Other = 'other',
  Personalcorporation = 'personalcorporation',
}

export enum DrawerActionEnum {
  Add = 'add',
  Modify = 'modify',
}
