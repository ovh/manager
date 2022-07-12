export default class GatewayModelSelectorService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getGatewayCatalog(ovhSubsidiary) {
    return this.$http
      .get('/order/catalog/public/cloud', {
        params: {
          ovhSubsidiary,
          productName: 'cloud',
        },
      })
      .then(({ data }) => {
        return data.addons
          .filter((addon) => addon.product.startsWith('publiccloud-gateway'))
          .map((gateway) => {
            return {
              ...gateway,
              gatewayPrice: gateway.pricings.find(
                ({ capacities, mode }) =>
                  capacities.includes('consumption') && mode === 'default',
              ),
            };
          })
          .reverse();
      });
  }
}
