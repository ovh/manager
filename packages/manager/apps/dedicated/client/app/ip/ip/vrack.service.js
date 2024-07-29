import { VRACK_SERVICE } from './ip-ip.constant';

export default /* @ngInject */ function Vrack($http, iceberg) {
  this.getIpInfo = (ipv6) => {
    return $http.get(`/ip/${encodeURIComponent(ipv6)}`);
  };

  this.getVrackService = () => {
    return iceberg('/vrack')
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

  this.addIpv6 = (serviceName, ipv6) => {
    return $http.post(`/vrack/${serviceName}/ipv6`, { block: ipv6 });
  };

  this.deleteIpv6 = (serviceName, ipv6) => {
    return $http.delete(
      `/vrack/${serviceName}/ipv6/${encodeURIComponent(ipv6)}`,
    );
  };
}
