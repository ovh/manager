export enum ServiceInfoType {
  French = 'french',
  FrenchInternational = 'french+international',
  International = 'international',
}

export enum ServiceInfoRenewMode {
  Automatic = 'automatic',
  Manual = 'manual',
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

export enum DomainProtectionStateEnum {
  Protected = 'PROTECTED',
  NotProtected = 'NOT_PROTECTED',
}

export enum ServiceResourceStatus {
  Active = 'active',
  Deleted = 'Deleted',
  Suspended = 'Suspended',
  ToActivate = 'toActivate',
  ToDelete = 'toDelete',
  ToSuspend = 'toSuspend',
}

export enum Gender {
  Masc = 'masc',
  Fem = 'fem',
}
