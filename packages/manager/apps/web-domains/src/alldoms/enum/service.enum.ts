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

export enum DomainStateEnum {
  autorenew_in_progress = 'autorenew_in_progress',
  autorenew_registry_in_progress = 'autorenew_registry_in_progress',
  deleted = 'deleted',
  dispute = 'dispute',
  expired = 'expired',
  ok = 'ok',
  outgoing_transfer = 'outgoing_transfer',
  pending_create = 'pending_create',
  pending_delete = 'pending_delete',
  pending_incoming_transfer = 'pending_incoming_transfer',
  pending_installation = 'pending_installation',
  registry_suspended = 'registry_suspended',
  restorable = 'restorable',
  technical_suspended = 'technical_suspended',
}

export enum ServiceInfoContactEnum {
  Administrator = 'administrator',
  Technical = 'technical',
  Billing = 'billing',
}
