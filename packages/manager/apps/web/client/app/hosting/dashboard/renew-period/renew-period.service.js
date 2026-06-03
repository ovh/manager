import {
  BILLING_RENEW_URLS,
  DEFAULT_BILLING_RENEW_SUBSIDIARY,
} from './renew-period.constant';

/**
 * Get the subsidiary-specific renew order URL with the service name injected
 * @param {string} subsidiary
 * @param {string} serviceName
 * @returns {string|null}
 */
export function getBillingRenewUrl(subsidiary, serviceName) {
  const url =
    BILLING_RENEW_URLS[subsidiary] ||
    BILLING_RENEW_URLS[DEFAULT_BILLING_RENEW_SUBSIDIARY];
  if (!url) return null;
  return url.replace('{serviceName}', serviceName || '');
}

/**
 * Convert an ISO 8601 period (e.g. P1Y, P3M) to a number of months
 * @param {string} period
 * @returns {number}
 */
export function convertPeriodToMonths(period) {
  if (!period || typeof period !== 'string') return 0;
  const value = parseInt(period.slice(1, -1), 10);
  const unit = period.slice(-1);
  if (!Number.isFinite(value)) return 0;
  return unit === 'Y' ? value * 12 : value;
}

export default class HostingRenewPeriodService {
  /* @ngInject */
  constructor($http, $q) {
    this.$http = $http;
    this.$q = $q;
  }

  /**
   * Get the numeric service id from the hosting service name
   * @param {string} serviceName
   * @returns {Promise}
   */
  getServiceId(serviceName) {
    return this.$http
      .get('/services', { params: { resourceName: serviceName } })
      .then(({ data }) =>
        Array.isArray(data) && data.length ? data[0] : null,
      );
  }

  /**
   * Get service details (capabilities and current renewal state)
   * @param {number} serviceId
   * @returns {Promise}
   */
  getServiceDetail(serviceId) {
    return this.$http.get(`/services/${serviceId}`).then(({ data }) => data);
  }

  /**
   * Get available renewal frequencies, deduplicated by months and sorted ascending
   * @param {number} serviceId
   * @returns {Promise}
   */
  getAvailableEngagements(serviceId) {
    return this.$http
      .get(`/services/${serviceId}/billing/engagement/available`)
      .then(({ data }) => {
        const byMonths = new Map();
        (data || []).forEach((offer) => {
          if (!offer?.duration) return;
          const months = convertPeriodToMonths(offer.duration);
          if (!(months > 0)) return;
          if (!byMonths.has(months)) {
            byMonths.set(months, {
              months,
              duration: offer.duration,
              pricingMode: offer.pricingMode,
              description: offer.description,
              price: offer.price,
              raw: offer,
            });
          }
        });
        return [...byMonths.values()].sort((a, b) => a.months - b.months);
      });
  }

  /**
   * Submit an engagement request: delete the pending one if any, then post the chosen pricingMode
   * @param {number} serviceId
   * @param {string} pricingMode
   * @returns {Promise}
   */
  submitEngagementRequest(serviceId, pricingMode) {
    if (!pricingMode) {
      return this.$q.reject(
        new Error('submitEngagementRequest: missing pricingMode'),
      );
    }
    const path = `/services/${serviceId}/billing/engagement/request`;

    return this.$http
      .get(path)
      .then(
        () => this.$http.delete(path),
        (err) => {
          if (err?.status === 404) return null;
          return this.$q.reject(err);
        },
      )
      .then(() => this.$http.post(path, { pricingMode }));
  }
}
