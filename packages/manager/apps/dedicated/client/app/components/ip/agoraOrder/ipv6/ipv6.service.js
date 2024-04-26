import { PRODUCT_TYPES } from './ipv6.constant';

export default class IpAgoraV6Order {
  /* @ngInject */
  constructor($http, IpAgoraOrder) {
    this.$http = $http;
    this.IpAgoraOrder = IpAgoraOrder;
  }

  getVrackService() {
    return this.$http
      .get('/products', {
        params: {
          product: PRODUCT_TYPES.vrack.apiTypeName,
        },
        serviceType: 'aapi',
      })
      .then(({ data }) => {
        const availableVrack = this.IpAgoraOrder.handleErrorOrServices(data);
        return [
          ...availableVrack.map((vrackService) => ({
            ...vrackService,
            type: PRODUCT_TYPES.vrack.apiTypeName,
          })),
        ];
      });
  }
}
