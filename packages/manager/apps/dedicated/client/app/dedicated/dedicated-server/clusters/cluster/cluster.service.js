export default class Cluster {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getSelected(serviceName) {
    return this.$http
      .get(`/dedicated/cluster/${serviceName}`)
      .then(({ data }) => data);
  }

  getServiceInfos(serviceName) {
    return this.$http
      .get(`/dedicated/cluster/${serviceName}/serviceInfos`)
      .then(({ data }) => data);
  }

  getCommercialName(serviceInfos) {
    const { serviceId } = serviceInfos;
    return this.$http
      .get(`/services/${serviceId}`)
      .then(({ data }) => data?.billing?.plan?.invoiceName);
  }
}
