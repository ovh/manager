export enum RenewalTypeEnum {
  AUTOMATIC_FORCED_PRODUCT = 'automaticForcedProduct',
  AUTOMATIC_V2012 = 'automaticV2012',
  AUTOMATIC_V2014 = 'automaticV2014',
  AUTOMATIC_V2016 = 'automaticV2016',
  AUTOMATIC_V2024 = 'automaticV2024',
  MANUAL = 'manual',
  ONE_SHOT = 'oneShot',
  OPTION = 'option',
}

export enum StateEnum {
  AUTO_RENEW_IN_PROGRESS = 'autorenewInProgress',
  EXPIRED = 'expired',
  IN_CREATION = 'inCreation',
  OK = 'ok',
  PENDING_DEBT = 'pendingDebt',
  UNPAID = 'unPaid',
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
