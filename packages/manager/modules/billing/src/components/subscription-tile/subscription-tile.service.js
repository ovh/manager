import { BillingService, Engagement, Service } from '@ovh-ux/manager-models';

export default class {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getServiceInfos(servicePath) {
    return this.$http
      .get(`${servicePath}/serviceInfos`)
      .then(({ data }) => new BillingService(data));
  }

  getService({ serviceId }) {
    return this.$http
      .get(`/services/${serviceId}`)
      .then(({ data }) => new Service(data));
  }

  getEngagement({ serviceId }) {
    return this.$http
      .get(`/services/${serviceId}/billing/engagement`)
      .then(({ data }) => new Engagement(data));
  }
}
