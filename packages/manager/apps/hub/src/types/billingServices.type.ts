import { ApiAggregateEnvelope, ApiEnvelope } from '@/types/apiEnvelope.type';

export const DEBT_STATUS = ['PENDING_DEBT', 'UN_PAID', 'UNPAID'];

type ServiceState =
  // Agora API statuses
  | 'ACTIVE'
  | 'ERROR'
  | 'RUPTURE'
  | 'TERMINATED'
  | 'TO_RENEW'
  | 'UNPAID'
  | 'UNRENEWED'
  // Rebound statuses
  | 'EXPIRED'
  | 'PENDING_DEBT'
  | 'DELETE_AT_EXPIRATION'
  | 'AUTO'
  | 'MANUAL';

export type BillingServiceData = {
  canDeleteAtExpiration: boolean;
  contactAdmin: string;
  contactBilling: string;
  creation?: string;
  domain: string;
  expiration: string;
  id: number | string;
  renew: {
    automatic: boolean;
    deleteAtExpiration: boolean;
    forced: boolean;
    manualPayment: boolean;
    period: number;
  };
  renewalType: string;
  serviceId: string;
  serviceType: string;
  // FIXME: this should be `status: ServiceState;`but not sure this is the reality
  status: string;
  url: string;
};

export type BillingServicesData = {
  billingServices: ApiEnvelope<ApiAggregateEnvelope<BillingServiceData[]>>;
};

export type HubBillingServices = {
  services: BillingService[];
  count: number;
};

export class BillingService implements BillingServiceData {
  canDeleteAtExpiration: boolean;

  contactAdmin: string;

  contactBilling: string;

  domain: string;

  expiration: string;

  id: number | string;

  renew: {
    automatic: boolean;
    deleteAtExpiration: boolean;
    forced: boolean;
    manualPayment: boolean;
    period: number;
  };

  renewalType: string;

  serviceId: string;

  serviceType: string;

  status: string;

  url: string;

  expirationDate: Date;

  formattedExpiration: Date;

  creationDate: Date;

  constructor({
    canDeleteAtExpiration,
    contactAdmin,
    contactBilling,
    creation,
    domain,
    expiration,
    id,
    renew,
    renewalType,
    serviceId,
    serviceType,
    status,
    url,
  }: BillingServiceData) {
    this.canDeleteAtExpiration = canDeleteAtExpiration;
    this.contactAdmin = contactAdmin;
    this.contactBilling = contactBilling;
    this.domain = domain;
    this.expiration = expiration;
    this.id = id;
    this.renew = renew;
    this.renewalType = renewalType;
    this.serviceId = serviceId;
    this.serviceType = serviceType;
    this.status = status;
    this.url = url;

    this.id = id || serviceId;
    this.expirationDate = new Date(this.expiration);
    this.creationDate = new Date(creation);
    this.formattedExpiration = new Date(this.expiration);
  }

  getRenew() {
    if (this.isResiliated()) {
      return 'expired';
    }

    if (this.isManualForced()) {
      return this.status.toLowerCase();
    }

    if (this.hasManualRenew()) {
      return 'manualPayment';
    }

    if (this.shouldDeleteAtExpiration() && !this.isResiliated()) {
      return 'delete_at_expiration';
    }

    if (this.hasAutomaticRenew() || this.hasForcedRenew()) {
      return 'automatic';
    }

    return 'manualPayment';
  }

  isResiliated() {
    return (
      this.isExpired() || ['TERMINATED'].includes(this.status.toUpperCase())
    );
  }

  isExpired(): boolean {
    return ['expired', 'unrenewed'].includes(this.status.toLowerCase());
  }

  isManualForced(): boolean {
    return this.status === 'FORCED_MANUAL';
  }

  hasManualRenew(): boolean {
    // From the API code, this.renew.manualPayment is true if this.renewalType === 'manual'
    // So this code could be simplified
    return this.renew.manualPayment || this.renewalType === 'manual';
  }

  shouldDeleteAtExpiration(): boolean {
    return Boolean(this.renew.deleteAtExpiration);
  }

  hasAutomaticRenew() {
    return this.renew.automatic;
  }

  hasAutomaticRenewal() {
    return this.hasForcedRenew() || this.hasAutomaticRenew();
  }

  hasForcedRenew() {
    return (
      this.renew.forced && !this.shouldDeleteAtExpiration() && !this.isExpired()
    );
  }

  hasDebt() {
    return DEBT_STATUS.includes(this.status);
  }

  isOneShot() {
    return this.renewalType === 'oneShot';
  }

  hasPendingResiliation() {
    return (
      this.shouldDeleteAtExpiration() &&
      !this.hasManualRenew() &&
      !this.isResiliated()
    );
  }
}
