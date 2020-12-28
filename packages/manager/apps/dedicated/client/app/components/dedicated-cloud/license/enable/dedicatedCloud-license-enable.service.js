import assign from 'lodash/assign';
import filter from 'lodash/filter';
import find from 'lodash/find';
import forEach from 'lodash/forEach';

import { OVERRIDE_CONTRACTS } from './dedicatedCloud-license-enable.constants';

export default class {
  /* @ngInject */
  constructor($translate, OvhApiOrder) {
    this.$translate = $translate;
    this.OvhApiOrder = OvhApiOrder;
  }

  fetchContracts(offer, service, ovhSubsidiary) {
    return this.OvhApiOrder.Cart()
      .v6()
      .post({
        ovhSubsidiary,
      })
      .$promise.then(({ cartId }) =>
        this.OvhApiOrder.Cart()
          .v6()
          .assign({
            cartId,
          })
          .$promise.then(
            () =>
              this.OvhApiOrder.CartServiceOption()
                .v6()
                .post(
                  {
                    productName: 'privateCloud',
                    serviceName: service.serviceName,
                  },
                  {
                    cartId,
                    duration: offer.prices[0].duration,
                    planCode: offer.planCode,
                    pricingMode: offer.prices[0].pricingMode,
                    quantity: 1,
                  },
                ).$promise,
          )
          .then(
            () =>
              this.OvhApiOrder.Cart()
                .v6()
                .getCheckout({
                  cartId,
                }).$promise,
          ),
      )
      .then(({ contracts }) =>
        this.transformContracts(contracts, service.productReference),
      );
  }

  fetchOffers(serviceName) {
    return this.OvhApiOrder.CartServiceOption()
      .v6()
      .get({
        productName: 'privateCloud',
        serviceName,
      })
      .$promise.then((offers) =>
        filter(offers, { planCode: 'pcc-option-windows' }),
      );
  }

  transformContracts(contracts, serviceType) {
    forEach(OVERRIDE_CONTRACTS, (OVERRIDE_CONTRACT) => {
      const contractToOverride = find(contracts, {
        name: OVERRIDE_CONTRACT.NAME,
      });
      if (contractToOverride && OVERRIDE_CONTRACT.TYPE === serviceType) {
        assign(contractToOverride, {
          name: this.$translate.instant(
            `dedicatedCloud_tab_licences_contract_name_${serviceType}`,
          ),
          url: OVERRIDE_CONTRACT.URL,
        });
      }
    });
    return contracts;
  }
}
