interface ServiceInfos {
  canDeleteAtExpiration: boolean;
  contactAdmin: string;
  contactBilling: string;
  contactTech: string;
  creation: Date;
  domain: string;
  engagedUpTo: Date | null;
  expiration: Date;
  possibleRenewPeriod: number[] | null;
  renew: RenewType | null;
  serviceId: number;
}

interface RenewType {
  duration: number;
  manualPayment: boolean;
  automatic: boolean;
  deleteAtExpiration: boolean;
  forced: boolean;
  period: number;
  deleteAtExpirationPossible: boolean;
}

export default ServiceInfos;
