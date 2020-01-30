import get from 'lodash/get';
import head from 'lodash/head';
import filter from 'lodash/filter';

angular.module('managerApp').controller(
  'CloudProjectBillingVouchersAddcreditAgoraCtrl',
  class CloudProjectBillingVouchersAddcreditAgoraCtrl {
    constructor(
      $http,
      $q,
      $translate,
      $uibModalInstance,
      $window,
      CucCloudMessage,
      CucCurrencyService,
      OvhApiMe,
      OvhApiOrderCatalogPublic,
    ) {
      this.$http = $http;
      this.$q = $q;
      this.$translate = $translate;
      this.$uibModalInstance = $uibModalInstance;
      this.$window = $window;
      this.CucCloudMessage = CucCloudMessage;
      this.CucCurrencyService = CucCurrencyService;
      this.OvhApiMe = OvhApiMe;
      this.OvhApiOrderCatalogPublic = OvhApiOrderCatalogPublic;
      this.orderLimits = {
        min: 1,
        max: 20000000,
      };
    }

    $onInit() {
      this.amount = 10;
      this.loading = true;
      return this.OvhApiMe.v6()
        .get()
        .$promise.then((me) =>
          this.OvhApiOrderCatalogPublic.v6()
            .get({ productName: 'cloud', ovhSubsidiary: me.ovhSubsidiary })
            .$promise.then((result) => {
              const pricing = head(
                filter(
                  get(
                    head(
                      filter(
                        get(result, 'plans'),
                        (p) =>
                          p.planCode === 'credit' &&
                          p.pricingType === 'purchase',
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
            }),
        )
        .catch((err) => {
          this.CucCloudMessage.error(
            [
              this.$translate.instant('cpb_vouchers_add_credit_load_err'),
              get(err, 'data.message', ''),
            ].join(' '),
          );
          this.$uibModalInstance.dismiss();
          return this.$q.reject(err);
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
        `https://us.ovhcloud.com/order/express/#/express/review?products=${JSURL.stringify(
          [order],
        )}`,
        '_blank',
      );
      this.$uibModalInstance.dismiss();
    }

    cancel() {
      this.$uibModalInstance.dismiss();
    }
  },
);
