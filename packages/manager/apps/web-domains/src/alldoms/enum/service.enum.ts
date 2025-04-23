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

export enum ServiceResourceStatus {
  Creating = 'CREATING',
  Deleting = 'DELETING',
  Error = 'ERROR',
  Ready = 'READY',
  Suspended = 'SUSPENDED',
  Updating = 'UPDATING',
}
