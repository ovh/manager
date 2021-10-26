import assign from 'lodash/assign';
import head from 'lodash/head';
import includes from 'lodash/includes';
import isNull from 'lodash/isNull';
import snakeCase from 'lodash/snakeCase';
import 'moment';

import { DEBT_STATUS } from './billing-service.constants';

export default class BillingService {
  constructor(service) {
    Object.assign(this, service);

    this.id = service.id || service.serviceId;
    this.expirationDate = moment(this.expiration);
    this.creationDate = moment(this.creation);

    if (this.status) {
      this.state = this.isSuspended() ? 'EXPIRED' : 'UP';
    }
  }

  getServiceName() {
    return this.serviceId;
  }

  get formattedExpiration() {
    return this.expirationDate.format('LL');
  }

  get formattedCreationDate() {
    return this.creationDate.format('LL');
  }

  isBillingSuspended() {
    return this.status === 'BILLING_SUSPENDED';
  }

  isManualForced() {
    return this.status === 'FORCED_MANUAL';
  }

  getRenew() {
    if (this.isBillingSuspended()) {
      return this.status.toLowerCase();
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
    return (
      this.renew.forced && !this.shouldDeleteAtExpiration() && !this.isExpired()
    );
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
      (moment().isAfter(this.expirationDate) &&
        !this.hasAutomaticRenew() &&
        !this.hasForcedRenew())
    );
  }

  hasDebt() {
    return includes(DEBT_STATUS, snakeCase(this.status).toUpperCase());
  }

  hasEngagement() {
    return !isNull(this.engagedUpTo) && moment().isBefore(this.engagedUpTo);
  }

  hasEngagementDetails() {
    return this.engagementDetails != null;
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
    return this.canBeEngaged;
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

  canCommit() {
    return (
      !this.isResiliated() && !this.isExpired() && !this.hasPendingResiliation()
    );
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

  canBeResiliated(nichandle) {
    return this.canDeleteAtExpiration && this.hasAdminRights(nichandle);
  }

  canResiliateByEndRule() {
    return (
      this.hasEngagementDetails() &&
      this.engagementDetails.endRule &&
      this.engagementDetails.endRule.strategy === 'REACTIVATE_ENGAGEMENT' &&
      this.engagementDetails.endRule.possibleStrategies.length > 0
    );
  }

  canCancelResiliationByEndRule() {
    return (
      this.engagementDetails &&
      this.engagementDetails.endRule &&
      this.engagementDetails.endRule.possibleStrategies.includes(
        'REACTIVATE_ENGAGEMENT',
      )
    );
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

  hasResiliationRights(nichandle) {
    return this.hasBillingRights(nichandle) || nichandle === this.contactAdmin;
  }

  canBeUnresiliated(nichandle) {
    return (
      this.shouldDeleteAtExpiration() &&
      !this.hasManualRenew() &&
      this.hasResiliationRights(nichandle)
    );
  }

  isSuspended() {
    return this.status === 'UN_PAID' || this.isResiliated();
  }

  hasPendingResiliation() {
    return (
      this.shouldDeleteAtExpiration() &&
      !this.hasManualRenew() &&
      !this.isResiliated()
    );
  }
}
