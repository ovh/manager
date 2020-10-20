import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import set from 'lodash/set';

export default class NashaAddService {
  /* @ngInject */
  constructor(
    $http,
    $q,
    $translate,
    CucOrderHelperService,
    OvhApiMe,
    OvhApiOrder,
    CucServiceHelper,
  ) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
    this.CucOrderHelperService = CucOrderHelperService;
    this.OvhApiMe = OvhApiMe;
    this.OvhApiOrder = OvhApiOrder;
    this.CucServiceHelper = CucServiceHelper;
  }

  getAvailableRegions() {
    return this.OvhApiOrder.v6()
      .schema()
      .$promise.then((response) =>
        filter(
          response.models['dedicated.NasHAZoneEnum'].enum,
          (datacenter) => datacenter !== 'gra',
        ),
      )
      .catch(this.CucServiceHelper.errorHandler('nasha_order_loading_error'));
  }

  getCatalog() {
    return this.OvhApiMe.v6()
      .get()
      .$promise.then(({ ovhSubsidiary }) =>
        this.$http
          .get('/order/catalog/public/nasha', {
            params: {
              ovhSubsidiary,
            },
          })
          .then(({ data }) => data),
      );
  }

  getOffers() {
    return this.OvhApiMe.v6()
      .get()
      .$promise.then(
        (user) =>
          this.OvhApiOrder.Cart()
            .v6()
            .post({}, { ovhSubsidiary: user.ovhSubsidiary }).$promise,
      )
      .then((cart) =>
        this.OvhApiOrder.Cart()
          .Product()
          .v6()
          .get({ cartId: cart.cartId, productName: 'nasha' })
          .$promise.then((offers) => ({ cart, offers })),
      )
      .then((response) => {
        forEach(response.offers, (offer) => {
          set(
            offer,
            'productName',
            this.$translate.instant(`nasha_order_nasha_${offer.planCode}`),
          );
        });

        this.OvhApiOrder.Cart()
          .v6()
          .assign({ cartId: response.cart.cartId })
          .$promise.then(() =>
            this.OvhApiOrder.Cart()
              .v6()
              .delete({ cartId: response.cart.cartId }),
          );

        return response.offers;
      })
      .catch(this.CucServiceHelper.errorHandler('nasha_order_loading_error'));
  }

  getDurations() {
    return this.$q.when([
      {
        value: 1,
        text: `01 ${this.$translate.instant('nas_order_month')}`,
      },
      {
        value: 3,
        text: `03 ${this.$translate.instant('nas_order_month')}`,
      },
      {
        value: 6,
        text: `06 ${this.$translate.instant('nas_order_month')}`,
      },
      {
        value: 12,
        text: `12 ${this.$translate.instant('nas_order_month')}`,
      },
    ]);
  }

  order(model) {
    return this.CucOrderHelperService.getExpressOrderUrl({
      productId: 'nasha',
      duration: `P${model.selectedDuration}M`,
      planCode: model.selectedModel,
      pricingMode: 'default',
      quantity: 1,
      configuration: [
        {
          label: 'datacenter',
          values: [model.selectedDatacenter.toUpperCase()],
        },
      ],
    })
      .then((response) => ({ url: response }))
      .catch(
        this.CucServiceHelper.errorHandler('nasha_order_validation_error'),
      );
  }
}
