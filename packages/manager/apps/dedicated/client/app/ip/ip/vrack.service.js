import { VRACK_SERVICE } from './ip-ip.constant';

export default class Vrack {
  /* @ngInject */

  constructor($http, iceberg) {
    this.$http = $http;
    this.iceberg = iceberg;
  }

  getIpInfo = (ipv6) => {
    return this.$http.get(`/ip/${encodeURIComponent(ipv6)}`);
  };

  getVrackService = () => {
    return this.iceberg('/vrack')
      .query()
      .expand('CachedObjectList-Pages')
      .execute()
      .$promise.then(({ data }) =>
        data.map((vrackService) => {
          const serviceName = vrackService.iam.urn.split(':').pop();
          const service = vrackService.name || serviceName;
          return {
            service,
            serviceName,
            serviceType: VRACK_SERVICE,
          };
        }),
      );
  };

  getAllowedVrackServices = (serviceName) => {
    return this.$http
      .get(`/vrack/${serviceName}/allowedServices?serviceFamily=ipv6`)
      .then(({ data }) => data);
  };

  getVrackIpv6List = (serviceName) => {
    return this.$http
      .get(`/vrack/${serviceName}/ipv6`)
      .then(({ data }) => data);
  };

  addIpv6 = (serviceName, ipv6) => {
    return this.$http.post(`/vrack/${serviceName}/ipv6`, { block: ipv6 });
  };

  deleteIpv6 = (serviceName, ipv6) => {
    return this.$http.delete(
      `/vrack/${serviceName}/ipv6/${encodeURIComponent(ipv6)}`,
    );
  };
}
