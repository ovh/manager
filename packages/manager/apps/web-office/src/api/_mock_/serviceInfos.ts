import {
  OfficeLicenseServiceInfosType,
  RenewalTypeEnum,
  StateEnum,
} from '../serviceInfos/type';

export const mockOfficeLicenseServiceInfos: OfficeLicenseServiceInfosType = {
  canDeleteAtExpiration: true,
  contactAdmin: 'admin@example.com',
  contactBilling: 'billing@example.com',
  contactTech: 'tech@example.com',
  creation: '2023-01-15',
  domain: 'example.com',
  engagedUpTo: '2025-01-15',
  expiration: '2025-01-15',
  possibleRenewPeriod: [1],
  renew: {
    automatic: true,
    deleteAtExpiration: false,
    forced: true,
    manualPayment: null,
    period: 1,
  },
  renewalType: RenewalTypeEnum.AutomaticForcedProduct,
  serviceId: 12345,
  status: StateEnum.Ok,
};
