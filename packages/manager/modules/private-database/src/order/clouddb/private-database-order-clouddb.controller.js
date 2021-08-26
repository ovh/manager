import get from 'lodash/get';
import orderBy from 'lodash/orderBy';
import sortBy from 'lodash/sortBy';

import { PRODUCT_NAME } from './private-database-order-clouddb.constants';

export default class PrivateDatabaseOrderCloudDbCtrl {
  /* @ngInject */
  constructor($filter, $translate, PrivateDatabaseOrderCloudDb) {
    this.$filter = $filter;
    this.$translate = $translate;
    this.PrivateDatabaseOrderCloudDb = PrivateDatabaseOrderCloudDb;
  }

  $onInit() {
    this.currentIndex = 0;
    this.defaultModelType = PRODUCT_NAME;
    this.model = {};
  }

  selectTypeOption() {
    this.model.type = this.defaultModelType;
    this.currentIndex += 1;
  }

  initializeCustomizationOptions() {
    this.model.engine = undefined;
    this.model.ramSize = undefined;
    this.model.datacenter = undefined;

    this.engineList = orderBy(
      this.engines.map((engine) => {
        const [engineLabel, engineVersion] = engine.split('_');

        return {
          engineLabel,
          engineVersion: parseFloat(engineVersion),
          label: this.$translate.instant(
            `private_database_order_clouddb_server_version_${engineLabel}`,
            {
              version: engineVersion,
            },
          ),
          value: engine,
        };
      }),
      ['engineLabel', 'engineVersion'],
      ['asc', 'desc'],
    );

    this.ramSizeList = sortBy(
      this.ramSizes
        .map((ram) => parseInt(ram, 10))
        .map((ram) => ({
          label: this.$filter('cucBytes')(ram, undefined, false, 'MB'),
          value: ram,
        })),
      'value',
    );

    this.datacenterList = this.datacenters.map((datacenter) => ({
      label: this.$translate.instant(
        `private_database_order_clouddb_datacenter_${datacenter}`,
      ),
      value: datacenter,
    }));
  }

  canGoToDurationStep() {
    if (this.model.engine && this.model.ramSize && this.model.datacenter) {
      this.currentIndex += 1;
    }
  }

  getDurationsAndPricings() {
    this.model.duration = undefined;
    this.loadingDurations = true;
    const ramSizeRegExp = new RegExp(this.model.ramSize.value);
    return this.PrivateDatabaseOrderCloudDb.getDurationsFromRamOption(
      this.cartId,
      this.model.ramSize.value,
    )
      .then((durations) => {
        const catalogPrices = this.catalog.plans.find(({ planCode }) =>
          ramSizeRegExp.test(planCode),
        ).pricings;

        this.durations = durations
          .map((duration) => {
            const pricing = catalogPrices.find(
              ({ interval }) => interval === duration.interval,
            );

            return {
              ...duration,
              ...pricing,
            };
          })
          .filter(({ capacities }) => capacities.includes('renew'));
      })
      .finally(() => {
        this.loadingDurations = false;
      });
  }

  goToPaymentStep() {
    if (this.model.duration) {
      this.currentIndex += 1;
    }
  }

  prepareCheckout() {
    this.loadingCheckout = true;
    const checkoutData = {
      datacenter: this.model.datacenter.value,
      engine: this.model.engine.value,
      ramSize: this.model.ramSize.value,
      duration: this.model.duration.duration,
      pricingMode: this.model.duration.pricingMode,
    };

    return this.PrivateDatabaseOrderCloudDb.prepareCheckout(
      this.cartId,
      checkoutData,
    )
      .then(({ contracts, prices }) => {
        this.contracts = contracts;
        this.prices = prices;
      })
      .catch((error) => {
        this.displayErrorMessage(
          `${this.$translate.instant(
            'private_database_order_clouddb_payment_get_checkout_error',
          )} ${get(error, 'data.message', error.message)}`,
        );
      })
      .finally(() => {
        this.loadingCheckout = false;
      });
  }

  validateCheckout() {
    this.loadingCheckout = true;
    return this.PrivateDatabaseOrderCloudDb.validateCheckout(this.cartId, {
      autoPayWithPreferredPaymentMethod: !!this.defaultPaymentMethod,
      waiveRetractionPeriod: false,
    })
      .then(({ prices, url }) => {
        this.hasValidatedCheckout = true;
        if (!this.autoPayWithPreferredPaymentMethod) {
          this.openBill(url);
          this.displaySuccessMessage(
            `${this.$translate.instant(
              'private_database_order_clouddb_bill_success',
              { billUrl: url },
            )}`,
          );
        } else {
          this.displaySuccessMessage(
            `${this.$translate.instant(
              'private_database_order_clouddb_payment_checkout_success',
              {
                accountId: this.defaultPaymentMean.label,
                price: prices.withTax.text,
                billUrl: url,
              },
            )}`,
          );
        }
      })
      .catch(() => {
        this.displayErrorMessage(
          `${this.$translate.instant(
            'private_database_order_clouddb_payment_checkout_error',
          )}`,
        );
      })
      .finally(() => {
        this.loadingCheckout = false;
      });
  }

  displayErrorGetPaymentMethod() {
    this.displayErrorMessage(
      this.$translate.instant(
        'private_database_order_clouddb_payment_get_payment_method_error',
      ),
    );
  }
}
