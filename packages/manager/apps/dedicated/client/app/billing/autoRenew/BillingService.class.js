import assign from 'lodash/assign';
import head from 'lodash/head';
import includes from 'lodash/includes';
import isNull from 'lodash/isNull';

export default class BillingService {
  constructor(service) {
    Object.assign(this, service);

    this.expirationDate = moment(this.expiration);
  }

  get formattedExpiration() {
    return this.expirationDate.format('LL');
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
    return this.isExpired()
            || (
              moment().isAfter(this.expirationDate)
                && !this.hasAutomaticRenew()
                && !this.hasForcedRenew()
            );
  }

  hasDebt() {
    return includes(['PENDING_DEBT', 'UN_PAID'], this.status);
  }

  hasEngagement() {
    return !isNull(this.engagedUpTo);
  }

  setRenewPeriod(period) {
    this.renew.period = period;
  }

  setAutomaticRenew(period) {
    assign(this.renew, {
      manualPayment: false,
      automatic: true,
      deleteAtExpiration: false,
      period: period || head(this.possibleRenewPeriod),
    });
  }

  setManualRenew() {
    assign(this.renew, {
      manualPayment: true,
      automatic: false,
      deleteAtExpiration: false,
    });
  }

  getExpirationDate() {
    return this.expirationDate.format('LL');
  }

  cancelResiliation() {
    this.renew.deleteAtExpiration = false;
  }

  canHaveEngagement() {
    return ['DEDICATED_SERVER'].includes(this.serviceType);
  }

  setForResiliation() {
    if (this.hasAutomaticRenew() && !this.isAutomaticallyRenewed()) {
      this.setManualRenew();
    }

    this.renew.deleteAtExpiration = true;
  }

  isAutomaticallyRenewed() {
    return ['automaticV2014', 'automaticV2016', 'automaticForcedProduct'].includes(this.renewalType);
  }

  hasBillingRights(nichandle) {
    return nichandle === this.contactBilling;
  }

  getAutorenewCapability(nichandle) {
    if (this.hasDebt()) {
      return {
        availabilty: false,
        reason: 'pending_debt',
      };
    }

    if (this.hasAutomaticRenewal()) {
      return {
        availabilty: false,
        reason: 'already_automatic',
      };
    }

    if (this.renewalType === 'oneShot' || this.isAutomaticallyRenewed()) {
      return {
        availabilty: false,
        reason: 'one_shot_automatic',
      };
    }

    if (this.hasBillingRights(nichandle)) {
      return {
        availabilty: false,
        reason: 'nic_rights',
      };
    }

    if (this.isResiliated()) {
      return {
        availabilty: false,
        reason: 'resiliation_pending',
      };
    }

    if (this.isExpired()) {
      return {
        availabilty: false,
        reason: 'expired',
      };
    }

    return {
      availabilty: true,
      reason: 'available',
    };
  }

  getManualRenewCapability(nichandle) {
    if (this.hasDebt()) {
      return {
        availabilty: false,
        reason: 'pending_debt',
      };
    }

    if (this.hasManualRenew()) {
      return {
        availabilty: false,
        reason: 'already_manual',
      };
    }

    if (this.renewalType === 'oneShot' || this.isAutomaticallyRenewed()) {
      return {
        availabilty: false,
        reason: 'one_shot_manual',
      };
    }

    if (this.hasBillingRights(nichandle)) {
      return {
        availabilty: false,
        reason: 'nic_rights',
      };
    }

    if (this.isResiliated()) {
      return {
        availabilty: false,
        reason: 'resiliation_pending',
      };
    }

    if (this.isExpired()) {
      return {
        availabilty: false,
        reason: 'expired',
      };
    }

    return {
      availabilty: true,
      reason: 'available',
    };
  }

  hasParticularRenew() {
    return ['EXCHANGE', 'SMS', 'EMAIL_DOMAIN'].includes(this.serviceType);
  }

  isOneShot() {
    return this.renewalType === 'oneShot';
  }

  canBeResiliated(nichandle) {
    return this.canDeleteAtExpiration && this.hasResiliationRights(nichandle);
  }

  hasResiliationRights(nichandle) {
    return this.hasBillingRights(nichandle) || nichandle === this.contactAdmin;
  }

  canBeUnresiliated(nichandle) {
    return this.hasPendingResiliation()
    && this.hasResiliationRights(nichandle);
  }

  isSuspended() {
    return this.status === 'UN_PAID' || this.isResiliated();
  }

  hasPendingResiliation() {
    return this.shouldDeleteAtExpiration()
    && !this.hasManualRenew();
  }
}
