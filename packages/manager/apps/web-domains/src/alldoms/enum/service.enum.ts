export enum ServiceInfoRenewEnum {
  AutomaticForce = 'automaticForcedProduct',
  Automatic2012 = 'automaticV2012',
  Automatic2014 = 'automaticV2014',
  Automatic2016 = 'automaticV2016',
  Manual = 'manual',
  OneShot = 'oneShot',
  Option = 'option',
}

export enum ServiceInfoStatus {
  AutorenewProgress = 'autorenewInProgress',
  Expired = 'expired',
  InCreation = 'inCreation',
  Ok = 'ok',
  PendingDebt = 'pendingDebt',
  UnPaid = 'unPaid',
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
