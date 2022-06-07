import find from 'lodash/find';

export default class {
  /* @ngInject */
  constructor($http, $q, ovhManagerRegionService) {
    this.$http = $http;
    this.$q = $q;
    this.ovhManagerRegionService = ovhManagerRegionService;
  }

  fetchCurrentPrice(serviceId) {
    return this.$http
      .post(`/service/${serviceId}/renew`, {
        dryRun: true,
        duration: 'P1M',
        services: [],
      })
      .then(({ data }) => data);
  }

  fetchNewPrice(ovhSubsidiary, planInformation, datacenter) {
    const hasWindowsOption = find(planInformation.options, (option) =>
      option.newPlan.includes('windows'),
    );
    return this.$http
      .post('/order/cart', {
        ovhSubsidiary,
      })
      .then(({ data }) =>
        this.$http.post(`/order/cart/${data.cartId}/assign`).then(() => data),
      )
      .then((data) =>
        this.$http.post(`/order/cart/${data.cartId}/vps`, {
          duration: 'P1M',
          planCode: planInformation.newPlan,
          pricingMode: 'default',
          quantity: 1,
        }),
      )
      .then(({ data }) => {
        const optionsPromise = planInformation.options.map((option) => {
          return this.$http.post(`/order/cart/${data.cartId}/vps/options`, {
            itemId: data.itemId,
            duration: 'P1M',
            planCode: option.newPlan,
            pricingMode: 'default',
            quantity: 1,
          });
        });

        optionsPromise.push(
          this.$http.post(
            `/order/cart/${data.cartId}/item/${data.itemId}/configuration`,
            {
              label: 'vps_datacenter',
              value: datacenter,
            },
          ),
        );

        optionsPromise.push(
          this.$http.post(
            `/order/cart/${data.cartId}/item/${data.itemId}/configuration`,
            {
              label: 'vps_os',
              value: hasWindowsOption
                ? 'Windows Server 2019 Standard (Desktop)'
                : 'Debian 10',
            },
          ),
        );

        return this.$q.all(optionsPromise).then(() => data);
      })
      .then(({ cartId }) => {
        return this.$http.get(`/order/cart/${cartId}/checkout`);
      })
      .then(({ data }) => {
        return { price: data, newPlan: planInformation.newPlan };
      });
  }
}
