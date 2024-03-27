import { PRODUCT_TYPES } from '../ip-ip-agoraOrder.constant';

export default class IpAgoraV6Order {
  /* @ngInject */
  constructor($q, $http, OvhHttp, IpAgoraOrder) {
    this.$q = $q;
    this.$http = $http;
    this.OvhHttp = OvhHttp;
    this.IpAgoraOrder = IpAgoraOrder;
  }

  getVrackService() {
    return this.OvhHttp.get('/products', {
      rootPath: '2api',
      params: {
        product: PRODUCT_TYPES.vrack.apiTypeName,
      },
    }).then((vrack) => {
      const availableVrack = this.IpAgoraOrder.handleErrorOrServices(vrack);
      return [
        ...availableVrack.map((vrackService) => ({
          ...vrackService,
          type: PRODUCT_TYPES.vrack.apiTypeName,
        })),
      ];
    });
  }

  getIpv6Catalog(ovhSubsidiary) {
    return this.OvhHttp.get(`/order/catalog/formatted/ip`, {
      rootPath: 'apiv6',
      params: {
        ovhSubsidiary,
      },
    }).then(({ plans }) => {
      return plans.filter((plan) => plan.planCode.match(/^ip-v6.*/) != null);
    });
  }
}
