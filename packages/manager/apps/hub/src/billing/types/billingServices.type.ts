import { ApiAggregateEnvelope, ApiEnvelope } from '@/types/apiEnvelope.type';

export const DEBT_STATUS = ['PENDING_DEBT', 'UN_PAID', 'UNPAID'];

export const BYOIP_SERVICE_PREFIX = 'byoip-failover-';

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

type ServiceMenuItems = {
  manageEmailAccountsInBilling: boolean;
  manageEmailAccountsInExchange: boolean;
  resiliate: boolean;
};

type EngagementStrategy =
  | 'CANCEL_SERVICE'
  | 'REACTIVATE_ENGAGEMENT'
  | 'STOP_ENGAGEMENT_FALLBACK_DEFAULT_PRICE'
  | 'STOP_ENGAGEMENT_KEEP_PRICE';

type EngagementDetails = {
  endDate: Date;
  endRule: {
    possibleStrategies: EngagementStrategy[];
    strategy: EngagementStrategy;
  };
};

export type BillingServiceData = {
  canBeEngaged?: boolean;
  canDeleteAtExpiration: boolean;
  contactAdmin: string;
  contactBilling: string;
  creation?: string;
  domain: string;
  engagedUpTo?: string | Date;
  engagementDetails?: EngagementDetails;
  expiration: string;
  hasPendingEngagement?: boolean;
  id: number | string;
  menuItems?: ServiceMenuItems;
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
  // Not sent by /hub/billingServices
  canBeEngaged?: boolean;

  canDeleteAtExpiration: boolean;

  contactAdmin: string;

  contactBilling: string;

  domain: string;

  expiration: string;

  engagedUpTo?: Date;

  engagementDetails?: EngagementDetails;

  // Not sent by /hub/billingServices
  hasPendingEngagement?: boolean;

  id: number | string;

  menuItems?: ServiceMenuItems;

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
    canBeEngaged,
    canDeleteAtExpiration,
    contactAdmin,
    contactBilling,
    creation,
    domain,
    engagedUpTo,
    engagementDetails,
    expiration,
    hasPendingEngagement,
    id,
    menuItems,
    renew,
    renewalType,
    serviceId,
    serviceType,
    status,
    url,
  }: BillingServiceData) {
    this.canBeEngaged = canBeEngaged;
    this.canDeleteAtExpiration = canDeleteAtExpiration;
    this.contactAdmin = contactAdmin;
    this.contactBilling = contactBilling;
    this.domain = domain;
    this.engagedUpTo = new Date(engagedUpTo);
    this.engagementDetails = engagementDetails;
    this.expiration = expiration;
    this.hasPendingEngagement = hasPendingEngagement;
    this.id = id;
    this.menuItems = menuItems;
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

  isBillingSuspended(): boolean {
    return this.status === 'BILLING_SUSPENDED';
  }

  getRenew(): string {
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

  isResiliated(): boolean {
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

  hasAutomaticRenew(): boolean {
    return this.renew.automatic;
  }

  hasAutomaticRenewal(): boolean {
    return this.hasForcedRenew() || this.hasAutomaticRenew();
  }

  hasForcedRenew(): boolean {
    return (
      this.renew.forced && !this.shouldDeleteAtExpiration() && !this.isExpired()
    );
  }

  hasDebt(): boolean {
    return DEBT_STATUS.includes(this.status);
  }

  isOneShot(): boolean {
    return this.renewalType === 'oneShot';
  }

  hasPendingResiliation(): boolean {
    return (
      this.shouldDeleteAtExpiration() &&
      !this.hasManualRenew() &&
      !this.isResiliated()
    );
  }

  hasResiliationRights(nichandle: string) {
    return this.hasBillingRights(nichandle) || nichandle === this.contactAdmin;
  }

  hasBillingRights(nichandle: string): boolean {
    return nichandle === this.contactBilling;
  }

  hasAdminRights(nichandle: string): boolean {
    return nichandle === this.contactAdmin;
  }

  isSuspended() {
    return DEBT_STATUS.includes(this.status) || this.isResiliated();
  }

  canHandleRenew() {
    return ![
      'VIP',
      'OVH_CLOUD_CONNECT',
      'PACK_XDSL',
      'XDSL',
      'OKMS_RESOURCE',
      'VRACK_SERVICES_RESOURCE',
    ].includes(this.serviceType);
  }

  canBeDeleted() {
    return (
      [
        'EMAIL_DOMAIN',
        'ENTERPRISE_CLOUD_DATABASE',
        'HOSTING_WEB',
        'HOSTING_PRIVATE_DATABASE',
        'WEBCOACH',
      ].includes(this.serviceType) && !this.isResiliated()
    );
  }

  hasParticularRenew() {
    return [
      'EXCHANGE',
      'EMAIL_EXCHANGE',
      'SMS',
      'EMAIL_DOMAIN',
      'VEEAM_ENTERPRISE',
    ].includes(this.serviceType);
  }

  hasEngagement() {
    return Boolean(this.engagedUpTo) && Date.now() < this.engagedUpTo.getTime();
  }

  canBeUnresiliated(nichandle: string) {
    return (
      this.shouldDeleteAtExpiration() &&
      !this.hasManualRenew() &&
      this.hasResiliationRights(nichandle)
    );
  }

  canCancelResiliationByEndRule() {
    return this.engagementDetails?.endRule?.possibleStrategies.includes(
      'REACTIVATE_ENGAGEMENT',
    );
  }

  canResiliateByEndRule() {
    return (
      this.engagementDetails?.endRule?.strategy === 'REACTIVATE_ENGAGEMENT' &&
      this.engagementDetails?.endRule?.possibleStrategies?.length > 0
    );
  }

  isByoipService() {
    return this.domain?.startsWith(BYOIP_SERVICE_PREFIX);
  }
}
