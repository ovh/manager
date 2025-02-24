export enum RenewalTypeEnum {
  AutomaticForcedProduct = 'automaticForcedProduct',
  AutomaticV2012 = 'automaticV2012',
  AutomaticV2014 = 'automaticV2014',
  AutomaticV2016 = 'automaticV2016',
  AutomaticV2024 = 'automaticV2024',
  Manual = 'manual',
  OneShot = 'oneShot',
  Option = 'option',
}

export enum StateEnum {
  AutoRenewInProgress = 'autorenewInProgress',
  Expired = 'expired',
  InCreation = 'inCreation',
  Ok = 'ok',
  PendingDebt = 'pendingDebt',
  UnPaid = 'unPaid',
}

export type RenewType = {
  automatic?: boolean;
  deleteAtExpiration?: boolean;
  forced?: boolean;
  manualPayment?: boolean | null;
  period?: number | null;
};

export type OfficeLicenseServiceInfosType = {
  canDeleteAtExpiration: boolean;
  contactAdmin: string;
  contactBilling: string;
  contactTech: string;
  creation: string;
  domain: string;
  engagedUpTo?: string;
  expiration: string;
  possibleRenewPeriod?: number[];
  renew?: RenewType | null;
  renewalType: RenewalTypeEnum;
  serviceId: number;
  status: StateEnum;
};
