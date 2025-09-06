import { isAfter, isBefore } from 'date-fns';

import { CustomerContact, ServiceDetails } from '@ovh-ux/manager-module-common-api';

export default class BillingDetails {
  id: number;

  billing: ServiceDetails['billing'];

  resource: ServiceDetails['resource'];

  contacts: ServiceDetails['customer']['contacts'];

  constructor(service: ServiceDetails) {
    this.id = service.serviceId;
    this.billing = service.billing;
    this.resource = service.resource;
    this.contacts = service.customer.contacts;
  }

  get contactAdmin() {
    return this.contacts.find((contact) => contact.type === 'administrator');
  }

  get contactBilling() {
    return this.contacts.find((contact) => contact.type === 'billing');
  }

  get renewPeriod() {
    return this.billing.renew.current.period;
  }

  isBillingSuspended() {
    return this.resource.state === 'suspended';
  }

  getRenew() {
    if (this.isBillingSuspended()) {
      return 'suspended';
    }

    if (this.isResiliated()) {
      return 'expired';
    }

    if (this.isAutomaticRenew()) {
      return 'automatic';
    }

    return 'manual';
  }

  isAutomaticRenew() {
    return this.billing.renew.current.mode === 'automatic';
  }

  isExpired() {
    return this.billing.lifecycle.current.state !== 'active';
  }

  isManualRenew() {
    return this.billing.renew?.current.mode === 'manual';
  }

  isResiliated() {
    return this.isExpired() || ['terminated'].includes(this.billing.lifecycle.current.state);
  }

  hasDebt() {
    return this.billing.lifecycle.current.state === 'unpaid';
  }

  hasEngagement() {
    return (
      !!this.billing?.engagement?.endDate &&
      isBefore(new Date(), new Date(this.billing?.engagement?.endDate))
    );
  }

  isEngagementExpired() {
    return (
      this.billing?.engagement?.endDate &&
      isAfter(new Date(), new Date(this.billing?.engagement?.endDate))
    );
  }

  hasEngagementDetails() {
    return this.billing.engagement != null;
  }

  getExpirationDate() {
    return this.billing.expirationDate;
  }

  hasBillingRights(nichandle: CustomerContact) {
    return nichandle === this.contactBilling;
  }

  hasAdminRights(nichandle: CustomerContact) {
    return nichandle === this.contactAdmin;
  }

  getAutorenewCapability(nichandle: CustomerContact) {
    if (this.hasDebt()) {
      return {
        availability: false,
        reason: 'pending_debt',
      };
    }

    if (this.isAutomaticRenew() && !this.isResiliated()) {
      return {
        availability: false,
        reason: 'already_automatic',
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

  getManualRenewCapability(nichandle: CustomerContact) {
    if (this.hasDebt()) {
      return {
        availability: false,
        reason: 'pending_debt',
      };
    }

    if (this.isManualRenew()) {
      return {
        availability: false,
        reason: 'already_manual',
      };
    }

    if (this.isAutomaticRenew()) {
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

  canBeResiliated(nichandle: CustomerContact) {
    return !this.billing.engagement && this.hasAdminRights(nichandle);
  }

  hasResiliationRights(nichandle: CustomerContact) {
    return this.hasBillingRights(nichandle) || nichandle === this.contactAdmin;
  }

  canBeUnresiliated(nichandle: CustomerContact) {
    return !this.isManualRenew() && this.hasResiliationRights(nichandle);
  }

  isSuspended() {
    return this.hasDebt() || this.isResiliated();
  }

  hasPendingResiliation() {
    return !this.isManualRenew() && !this.isResiliated() && this.shouldDeleteAtExpiration();
  }

  shouldDeleteAtExpiration() {
    return this.billing?.engagement?.endRule?.strategy === 'CANCEL_SERVICE';
  }

  isAutoCommitmentStrategy() {
    return this.billing.engagement?.endRule?.strategy === 'REACTIVATE_ENGAGEMENT';
  }
}
