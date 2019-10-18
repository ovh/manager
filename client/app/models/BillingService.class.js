import _ from 'lodash';
import { DEBT_STATUS } from './billing-service.constants';

export default class BillingService {
  constructor(service) {
    Object.assign(this, service);

    this.expirationDate = moment(this.expiration);
  }

  get serviceName() {
    return this.serviceId;
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
    return _.includes(
      DEBT_STATUS,
      _.snakeCase(this.status).toUpperCase(),
    );
  }

  hasEngagement() {
    return !_.isNull(this.engagedUpTo);
  }

  setRenewPeriod(period) {
    this.renew.period = period;
  }

  setAutomaticRenew(period) {
    _.assign(this.renew, {
      manualPayment: false,
      automatic: true,
      deleteAtExpiration: false,
      period: period || _.head(this.possibleRenewPeriod),
    });
  }

  setManualRenew() {
    _.assign(this.renew, {
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
    if (this.hasAutomaticRenew() && !(this.isAutomaticallyRenewed() || ['automaticV2014', 'automaticV2016'].includes(this.renewalType))) {
      this.setManualRenew();
    }

    this.renew.deleteAtExpiration = true;
  }

  isAutomaticallyRenewed() {
    return ['automaticForcedProduct'].includes(this.renewalType);
  }

  hasBillingRights(nichandle) {
    return nichandle === this.contactBilling;
  }

  hasAdminRights(nichandle) {
    return nichandle === this.contactAdmin;
  }

  getAutorenewCapability(nichandle) {
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

  getManualRenewCapability(nichandle) {
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

  hasParticularRenew() {
    return ['EXCHANGE', 'SMS', 'EMAIL_DOMAIN'].includes(this.serviceType);
  }

  isOneShot() {
    return this.renewalType === 'oneShot';
  }

  canBeResiliated(nichandle) {
    return this.canDeleteAtExpiration && this.hasAdminRights(nichandle);
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
    && !this.hasManualRenew()
    && !this.isResiliated();
  }
}
