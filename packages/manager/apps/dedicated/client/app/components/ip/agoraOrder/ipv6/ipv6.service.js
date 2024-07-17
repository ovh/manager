import { PRODUCT_TYPES } from './ipv6.constant';

export default class IpAgoraV6Order {
  /* @ngInject */
  constructor(iceberg, $http) {
    this.$http = $http;
    this.iceberg = iceberg;
  }

  getVrackService() {
    return this.iceberg('/vrack')
      .query()
      .expand('CachedObjectList-Pages')
      .execute()
      .$promise.then(({ data }) =>
        data.map((vrackService) => {
          const serviceName = vrackService.iam.urn.split(':').pop();
          const displayName = vrackService.name || serviceName;
          return {
            displayName,
            serviceName,
            type: PRODUCT_TYPES.vrack.apiTypeName,
          };
        }),
      );
  }

  fetchIpv6Services() {
    return this.$http
      .get(`/ip?isAdditionalIp=true&version=6`)
      .then(({ data }) => data);
  }

  fetchIpv6ServicesWithDetails() {
    return this.iceberg('/ip?isAdditionalIp=true&version=6')
      .query()
      .expand('CachedObjectList-Pages')
      .execute()
      .$promise.then(({ data }) => {
        return data.filter((ip) => ip.version === 6);
      });
  }
}
