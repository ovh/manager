import get from 'lodash/get';
import filter from 'lodash/filter';
import head from 'lodash/head';

// we should avoid require, but JSURL don't provide an es6 export
const { stringify } = require('jsurl');

export default class CloudProjectBillingVouchersAddcreditAgoraCtrl {
  /* @ngInject */
  constructor(
    $http,
    $q,
    $translate,
    $uibModalInstance,
    $window,
    coreConfig,
    CucCloudMessage,
    CucCurrencyService,
    OvhApiOrderCatalogPublic,
  ) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
    this.$uibModalInstance = $uibModalInstance;
    this.$window = $window;
    this.coreConfig = coreConfig;
    this.CucCloudMessage = CucCloudMessage;
    this.CucCurrencyService = CucCurrencyService;
    this.OvhApiOrderCatalogPublic = OvhApiOrderCatalogPublic;
    this.orderLimits = {
      min: 1,
      max: 20000000,
    };
  }

  $onInit() {
    this.amount = 10;
    this.loading = true;
    const { ovhSubsidiary } = this.coreConfig.getUser();
    return this.OvhApiOrderCatalogPublic.v6()
      .get({ productName: 'cloud', ovhSubsidiary })
      .$promise.then((result) => {
        const pricing = head(
          filter(
            get(
              head(
                filter(
                  get(result, 'plans'),
                  (p) =>
                    p.planCode === 'credit' && p.pricingType === 'purchase',
                ),
              ),
              'pricings',
            ),
            (p) => p.capacities.includes('installation'),
          ),
        );
        this.price = pricing
          ? {
              currencyCode: get(result, 'locale.currencyCode'),
              value: this.CucCurrencyService.convertUcentsToCurrency(
                pricing.price,
              ),
            }
          : undefined;
      })
      .catch((err) => {
        this.CucCloudMessage.error(
          [
            this.$translate.instant('cpb_vouchers_add_credit_load_err'),
            get(err, 'data.message', ''),
          ].join(' '),
        );
        return this.cancel();
      })
      .finally(() => {
        this.loading = false;
      });
  }

  order() {
    const order = {
      planCode: 'credit',
      productId: 'cloud',
      pricingMode: 'default',
      quantity: Math.floor(this.amount / this.price.value),
      configuration: [
        {
          label: 'type',
          value: 'public_cloud',
        },
      ],
    };
    this.$window.open(
      `https://us.ovhcloud.com/order/express/#/express/review?products=${stringify(
        [order],
      )}`,
      '_blank',
    );
    this.cancel();
  }

  cancel() {
    return this.$state.go('^');
  }
}
