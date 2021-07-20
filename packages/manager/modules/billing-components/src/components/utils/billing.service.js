import {
  BillingService as ServiceInfos,
  Commitment,
  Service,
} from '@ovh-ux/manager-models';
import { DEFAULT_DURATION, DEFAULT_TYPE } from './constants';

export default class BillingService {
  /* @ngInject */
  constructor($q, $http, coreConfig) {
    this.$q = $q;
    this.$http = $http;
    this.coreConfig = coreConfig;
  }

  getServiceInfos(servicePath) {
    return this.$http
      .get(`${servicePath}/serviceInfos`)
      .then(({ data }) => new ServiceInfos(data));
  }

  getService(serviceId) {
    return this.$http
      .get(`/services/${serviceId}`)
      .then(({ data }) => new Service(data, this.coreConfig.getUserLocale()));
  }

  getOptions(serviceId) {
    return this.$http
      .get(`/services/${serviceId}/options`)
      .then(({ data }) =>
        data.map(
          (option) => new Service(option, this.coreConfig.getUserLocale()),
        ),
      );
  }

  getAvailableEngagement(serviceId) {
    return this.$http
      .get(`/services/${serviceId}/billing/engagement/available`)
      .then(({ data }) => data)
      .then((commitments) =>
        commitments.map(
          (c) => new Commitment(c, this.coreConfig.getUserLocale()),
        ),
      );
  }

  getPendingEngagement(serviceId) {
    return this.$http
      .get(`/services/${serviceId}/billing/engagement/request`)
      .then(({ data }) => data);
  }

  putEndRuleStrategy(serviceId, strategy) {
    return this.$http.put(`/services/${serviceId}/billing/engagement/endRule`, {
      strategy,
    });
  }

  getAvailableEngagementFromCatalog(pricings) {
    return pricings
      .map((pricing) => ({
        ...pricing,
        priceInUcents: pricing.price,
        price: {
          value: pricing.price / 100000000,
          currencyCode: this.coreConfig.getUser().currency.code,
        },
        duration: pricing.engagementConfiguration?.duration || DEFAULT_DURATION,
        engagementConfiguration: pricing.engagementConfiguration || {
          type: DEFAULT_TYPE,
          duration: DEFAULT_DURATION,
        },
        pricingMode: pricing.mode,
      }))
      .map(
        (pricing) => new Commitment(pricing, this.coreConfig.getUserLocale()),
      );
  }
}
