import includes from 'lodash/includes';
import snakeCase from 'lodash/snakeCase';

import { DEBT_STATUS } from './payment-status-tile.constants';

export default class AutorenewService {
  constructor(service) {
    Object.assign(this, service);
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

  hasAutomaticRenewal() {
    return this.hasForcedRenew() || this.hasAutomaticRenew();
  }

  hasDebt() {
    return includes(DEBT_STATUS, snakeCase(this.status).toUpperCase());
  }

  hasForcedRenew() {
    return (
      this.renew.forced && !this.shouldDeleteAtExpiration() && !this.isExpired()
    );
  }

  hasManualRenew() {
    return this.renew.manualPayment || this.renewalType === 'manual';
  }

  hasPendingResiliation() {
    return (
      this.shouldDeleteAtExpiration() &&
      !this.hasManualRenew() &&
      !this.isResiliated()
    );
  }

  isExpired() {
    return this.status.toLowerCase() === 'expired';
  }

  isOneShot() {
    return this.renewalType === 'oneShot';
  }

  isResiliated() {
    return (
      this.isExpired() ||
      (new Date().getTime() > new Date(this.expiration).getTime() &&
        !this.hasAutomaticRenew() &&
        !this.hasForcedRenew())
    );
  }

  shouldDeleteAtExpiration() {
    return this.renew.deleteAtExpiration;
  }
}
