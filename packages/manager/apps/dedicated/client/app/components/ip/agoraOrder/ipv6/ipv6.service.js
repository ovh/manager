import { PRODUCT_TYPES } from './ipv6.constant';

export default class IpAgoraV6Order {
  /* @ngInject */
  constructor(iceberg) {
    this.iceberg = iceberg;
  }

  getVrackService() {
    return this.iceberg('/vrack')
      .query()
      .expand('CachedObjectList-Pages')
      .execute()
      .$promise.then(({ data }) => {
        return [
          ...data.map((vrackService) => {
            const serviceName = vrackService.iam.urn.split(':').pop();
            const displayName = vrackService.name || serviceName;
            return {
              displayName,
              serviceName,
              type: PRODUCT_TYPES.vrack.apiTypeName,
            };
          }),
        ];
      });
  }
}
