import { isFuture } from 'date-fns';
import includes from 'lodash/includes';
import snakeCase from 'lodash/snakeCase';

import { BillingData } from '@/api/dashboard/billing';

const DEBT_STATUS = ['PENDING_DEBT', 'UN_PAID', 'UNPAID'];

export const SERVICE_STATES = {
  error: ['expired', 'delete_at_expiration'],
  success: ['auto', 'automatic'],
  warning: ['manual', 'manualPayment'],
  info: ['billing_suspended', 'forced_manual'],
};

export function canBeDeleted(data: BillingData) {
  return (
    [
      'EMAIL_DOMAIN',
      'ENTERPRISE_CLOUD_DATABASE',
      'HOSTING_WEB',
      'HOSTING_PRIVATE_DATABASE',
      'WEBCOACH',
    ].includes(data.serviceType) && !isResiliated(data)
  );
}

/**
 * A service can be resiliated by the admin if it can be deleted at expiration.
 */
export function canBeResiliated(data: BillingData, nichandle: string) {
  return data.canDeleteAtExpiration && hasAdminRights(data, nichandle);
}

export function canBeUnresiliated(data: BillingData, nichandle: string) {
  return (
    shouldDeleteAtExpiration(data) &&
    !hasManualRenew(data) &&
    hasResiliationRights(data, nichandle)
  );
}

export function canCancelResiliationByEndRule(data: BillingData) {
  return (
    data.engagementDetails &&
    data.engagementDetails.endRule &&
    data.engagementDetails.endRule.possibleStrategies.includes(
      'REACTIVATE_ENGAGEMENT',
    )
  );
}

export function canHandleRenew(data: BillingData): boolean {
  return !['OVH_CLOUD_CONNECT', 'PACK_XDSL', 'VIP', 'XDSL'].includes(
    data.serviceType,
  );
}

export function canResiliateByEndRule(data: BillingData) {
  return (
    hasEngagementDetails(data) &&
    data.engagementDetails.endRule &&
    data.engagementDetails.endRule.strategy === 'REACTIVATE_ENGAGEMENT' &&
    data.engagementDetails.endRule.possibleStrategies.length > 0
  );
}

export function getRenew(data: BillingData): string {
  if (isBillingSuspended(data)) {
    return data.status.toLowerCase();
  }

  if (isResiliated(data)) {
    return 'expired';
  }

  if (isManualForced(data)) {
    return data.status.toLowerCase();
  }

  if (hasManualRenew(data)) {
    return 'manualPayment';
  }

  if (shouldDeleteAtExpiration(data) && !isResiliated(data)) {
    return 'delete_at_expiration';
  }

  if (hasAutomaticRenew(data) || hasForcedRenew(data)) {
    return 'automatic';
  }

  return 'manualPayment';
}

function hasAdminRights(data: BillingData, nichandle: string): boolean {
  return nichandle === data.contacts.admin;
}

function hasAutomaticRenew(data: BillingData): boolean {
  return data.renewalMode.automatic;
}

/**
 * A user has billing rights if it is the billing contact
 */
export function hasBillingRights(data: BillingData, nichandle: string): boolean {
  return nichandle === data.contacts.billing;
}

function isBillingSuspended(data: BillingData): boolean {
  return data.status === 'BILLING_SUSPENDED';
}

/**
 * A service is in debt if its status includes one of the DEBT_STATUS
 */
export function hasDebt(data: BillingData): boolean {
  return includes(DEBT_STATUS, snakeCase(data.status).toUpperCase());
}

export function hasEngagement(data: BillingData): boolean {
  return data.engagedUpTo && isFuture(new Date(data.engagedUpTo));
}

function hasEngagementDetails(data: BillingData) {
  return data.engagementDetails != null;
}

export function hasForcedRenew(data: BillingData) {
  return (
    data.renewalMode.forced && !shouldDeleteAtExpiration(data) && !isExpired(data)
  );
}

export function hasManualRenew(data: BillingData): boolean {
  return data.renewalMode.manualPayment || data.renewalMode.type === 'manual';
}

/**
 * Whether or not the service has a particular renew method (true for some service types)
 */
export function hasParticularRenew(data: BillingData): boolean {
  return [
    'EMAIL_DOMAIN',
    'EMAIL_EXCHANGE',
    'EXCHANGE',
    'SMS',
    'VEEAM_ENTERPRISE',
  ].includes(data.serviceType);
}

export function hasPendingResiliation(data: BillingData): boolean {
  return (
    shouldDeleteAtExpiration(data) &&
    !hasManualRenew(data) &&
    !isResiliated(data)
  );
}

function hasResiliationRights(data: BillingData, nichandle: string): boolean {
  return hasBillingRights(data, nichandle) || hasAdminRights(data, nichandle);
}

/**
 * A service is expired if its status is 'expired' or 'unrenewed'
 */
export function isExpired(data: BillingData): boolean {
  return ['expired', 'unrenewed'].includes(data.status.toLowerCase());
}

function isManualForced(data: BillingData): boolean {
  return data.status === 'FORCED_MANUAL';
}

/**
 * A service is a one shot if its renewal type is 'oneShot'
 */
export function isOneShot(data: BillingData): boolean {
  return data.renewalMode.type === 'oneShot';
}

/**
 * A service is resiliated if its status is expired or is 'TERMINATED'
 */
export function isResiliated(data: BillingData): boolean {
  return (
    isExpired(data) || ['TERMINATED'].includes(data.status.toUpperCase())
  );
}

export function isSuspended(data: BillingData): boolean {
  return DEBT_STATUS.includes(data.status) || isResiliated(data);
}

export function shouldDeleteAtExpiration(data: BillingData): boolean {
  return data.renewalMode.deleteAtExpiration;
}

export function shouldHideAutorenewStatus(data: BillingData) {
  return (
    isOneShot(data) || ['SMS'].includes(data.serviceType)
  );
}
