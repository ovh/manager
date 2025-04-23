export enum ServiceInfoRenewEnum {
  AutomaticForce = 'automaticForcedProduct',
  Automatic2012 = 'automaticV2012',
  Automatic2014 = 'automaticV2014',
  Automatic2016 = 'automaticV2016',
  Manual = 'manual',
  OneShot = 'oneShot',
  Option = 'option',
}

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

export enum DomainTransferLockStatusEnum {
  Locked = 'locked',
  Locking = 'locking',
  Unavailable = 'unavailable',
  Unlocked = 'unlocked',
  Unlocking = 'unlocking',
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

export enum DomainDnssecStatus {
  Enabled = 'ENABLED',
  Disabled = 'DISABLED',
}
