import { includes, snakeCase } from 'lodash-es';
import { parseISO, format, compareAsc } from 'date-fns';
import { BillingService, Renew } from '@/models/hub.d';

import { DEBT_STATUS } from '@/constants/billing-services_consts';

export default class BillingServiceClass implements BillingService {
  id: number | string;
  expirationDate: Date;
  state!: string;
  canDeleteAtExpiration!: boolean;
  contactAdmin!: string;
  contactBilling!: string;
  domain!: string;
  status!: string;
  engagedUpTo!: Date;
  expiration!: string;
  renew!: Renew;
  renewalType!: string;
  serviceId!: string;
  serviceType!: string;
  url!: string;

  constructor(service: BillingService) {
    Object.assign(this, service);

    this.id = service.id || service.serviceId;
    this.expirationDate = parseISO(service.expiration);

    if (service.status) {
      this.state = this.isSuspended() ? 'EXPIRED' : 'UP';
    }
  }

  getRenew() {
    if (this.hasManualRenew()) {
      return 'manualPayment';
    }

    if (this.shouldDeleteAtExpiration() && !this.isResiliated()) {
      return 'delete_at_expiration';
    }

    if (this.isResiliated()) {
      return 'expired';
    }

    if (this.hasAutomaticRenew() || this.hasForcedRenew()) {
      return 'automatic';
    }

    return 'manualPayment';
  }

  hasAutomaticRenew() {
    return this.renew.automatic;
  }

  hasForcedRenew() {
    return this.renew.forced && !this.shouldDeleteAtExpiration() && !this.isExpired();
  }

  isExpired() {
    return this.status.toLowerCase() === 'expired';
  }

  shouldDeleteAtExpiration() {
    return this.renew.deleteAtExpiration;
  }

  hasAutomaticRenewal() {
    return this.hasForcedRenew() || this.hasAutomaticRenew();
  }

  hasManualRenew() {
    return this.renew.manualPayment || this.renewalType === 'manual';
  }

  isResiliated() {
    return (
      this.isExpired() ||
      (compareAsc(Date.now(), this.expirationDate) === 1 &&
        !this.hasAutomaticRenew() &&
        !this.hasForcedRenew())
    );
  }

  hasDebt() {
    return includes(DEBT_STATUS, snakeCase(this.status).toUpperCase());
  }

  hasEngagement() {
    return !this.engagedUpTo && compareAsc(Date.now(), this.engagedUpTo) === -1;
  }

  setRenewPeriod(period: number) {
    this.renew.period = period;
  }

  setAutomaticRenew(period: number) {
    Object.assign(this.renew, {
      manualPayment: false,
      automatic: true,
      deleteAtExpiration: false,
      period,
    });
  }

  setManualRenew() {
    Object.assign(this.renew, {
      manualPayment: true,
      automatic: false,
      deleteAtExpiration: false,
    });
  }

  getExpirationDate() {
    return format(this.expirationDate, 'LL');
  }

  cancelResiliation() {
    this.renew.deleteAtExpiration = false;
  }

  canHaveEngagement() {
    return ['DEDICATED_SERVER'].includes(this.serviceType);
  }

  setForResiliation() {
    if (
      this.hasAutomaticRenew() &&
      !(
        this.isAutomaticallyRenewed() ||
        ['automaticV2014', 'automaticV2016'].includes(this.renewalType)
      )
    ) {
      this.setManualRenew();
    }

    this.renew.deleteAtExpiration = true;
  }

  isAutomaticallyRenewed() {
    return ['automaticForcedProduct'].includes(this.renewalType);
  }

  hasBillingRights(nichandle: string) {
    return nichandle === this.contactBilling;
  }

  hasAdminRights(nichandle: string) {
    return nichandle === this.contactAdmin;
  }

  getAutorenewCapability(nichandle: string) {
    if (this.hasDebt()) {
      return {
        availability: false,
        reason: 'pending_debt',
      };
    }

    if (this.hasAutomaticRenewal() && !this.isResiliated()) {
      return {
        availability: false,
        reason: 'already_automatic',
      };
    }

    if (this.renewalType === 'oneShot' || this.isAutomaticallyRenewed()) {
      return {
        availability: false,
        reason: 'one_shot_automatic',
      };
    }

    if (!this.hasBillingRights(nichandle)) {
      return {
        availability: false,
        reason: 'nic_rights',
      };
    }

    if (this.hasPendingResiliation()) {
      return {
        availability: false,
        reason: 'resiliation_pending',
      };
    }

    if (this.isResiliated()) {
      return {
        availability: false,
        reason: 'expired',
      };
    }

    return {
      availability: true,
      reason: 'available',
    };
  }

  getManualRenewCapability(nichandle: string) {
    if (this.hasDebt()) {
      return {
        availability: false,
        reason: 'pending_debt',
      };
    }

    if (this.hasManualRenew()) {
      return {
        availability: false,
        reason: 'already_manual',
      };
    }

    if (this.renewalType === 'oneShot' || this.isAutomaticallyRenewed()) {
      return {
        availability: false,
        reason: 'one_shot_manual',
      };
    }

    if (!this.hasBillingRights(nichandle)) {
      return {
        availability: false,
        reason: 'nic_rights',
      };
    }

    if (this.hasPendingResiliation()) {
      return {
        availability: false,
        reason: 'resiliation_pending',
      };
    }

    if (this.isResiliated()) {
      return {
        availability: false,
        reason: 'expired',
      };
    }

    return {
      availability: true,
      reason: 'available',
    };
  }

  canCommit() {
    return !this.isResiliated() && !this.isExpired() && !this.hasPendingResiliation();
  }

  hasParticularRenew() {
    return ['EXCHANGE', 'SMS', 'EMAIL_DOMAIN'].includes(this.serviceType);
  }

  canHandleRenew() {
    return !['VIP', 'OVH_CLOUD_CONNECT'].includes(this.serviceType);
  }

  isOneShot() {
    return this.renewalType === 'oneShot';
  }

  canBeResiliated(nichandle: string) {
    return this.canDeleteAtExpiration && this.hasAdminRights(nichandle);
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

  hasResiliationRights(nichandle: string) {
    return this.hasBillingRights(nichandle) || nichandle === this.contactAdmin;
  }

  canBeUnresiliated(nichandle: string) {
    return this.hasPendingResiliation() && this.hasResiliationRights(nichandle);
  }

  isSuspended() {
    return this.status === 'UN_PAID' || this.isResiliated();
  }

  hasPendingResiliation() {
    return this.shouldDeleteAtExpiration() && !this.hasManualRenew() && !this.isResiliated();
  }
}
