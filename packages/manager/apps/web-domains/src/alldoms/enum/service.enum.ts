export enum ServiceRoutes {
  Domain = '/domain',
  AllDom = '/allDom',
}

export enum ServiceInfoType {
  French = 'FRENCH',
  FrenchInternational = 'FRENCH+INTERNATIONAL',
  International = 'INTERNATIONAL',
}

export enum ServiceInfoRenewMode {
  Automatic = 'automatic',
  Manual = 'manual',
}

export enum LifecycleActionsEnum {
  EarlyRenewal = 'earlyRenewal',
  Terminate = 'terminate',
  TerminateAtEngagementDate = 'terminateAtEngagementDate',
  TerminateAtExpirationDate = 'terminateAtExpirationDate',
}
export enum ServiceInfoUpdateEnum {
  Empty = 'empty',
  TerminateAtEngagementDate = 'terminateAtEngagementDate',
  TerminateAtExpirationDate = 'terminateAtExpirationDate',
}

export enum ServiceInfoContactEnum {
  Administrator = 'administrator',
  Technical = 'technical',
  Billing = 'billing',
}

export enum DomainRegistrationStateEnum {
  Registered = 'REGISTERED',
  Unregistered = 'UNREGISTERED',
}

export enum ActionEnum {
  All = 'all',
  OnlyContact = 'onlycontact',
  OnlyRenew = 'onlyrenew',
}
