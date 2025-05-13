import set from 'lodash/set';
import { LANGUAGE_OVERRIDE } from '../dedicatedCloud-datacenter.constants';

export default class {
  /* @ngInject */
  constructor(
    $translate,
    $window,
    coreConfig,
    DedicatedCloud,
    RedirectionService,
  ) {
    this.$translate = $translate;
    this.$window = $window;
    this.DedicatedCloud = DedicatedCloud;
    this.ovhSubsidiary = coreConfig.getUser().ovhSubsidiary;
    this.currency = coreConfig.getUser().currency.code;
    this.expressOrderUrl = RedirectionService.getURL('expressOrder');
  }

  $onInit() {
    this.loader = false;

    this.commercialRange = {
      list: [],
      model: null,
    };

    this.load();
  }

  load() {
    this.loader = true;
    this.DedicatedCloud.getCommercialRangeCompliance(this.serviceName)
      .then((compliance) => {
        this.commercialRange.list = compliance;
        return this.calculateEstimate();
      })
      .catch((err) => {
        return this.goBack(
          `${this.$translate.instant(
            'dedicatedCloud_datacenters_adding_load_error',
          )} ${err.message || ''}`,
          'danger',
        );
      })
      .finally(() => {
        this.loader = false;
      });
  }

  calculateEstimate() {
    return this.DedicatedCloud.getCartServiceOption(this.serviceName).then(
      (cartServiceOption) => {
        // Loop over the list of available data centres
        this.commercialRange.list = this.commercialRange.list.map(
          (datacenter) => {
            // Addition of the different plancodes required
            const totalPrices =
              datacenter.addons?.reduce(
                (accumulator, { planCode, quantity }, index) =>
                  accumulator +
                  (cartServiceOption
                    .find((option) => option.planCode === planCode)
                    ?.prices.reduce(
                      (childAccumulator, { price, pricingMode }) => {
                        // We need set more parameters for express order url.
                        set(datacenter.addons, index, {
                          ...datacenter.addons[index],
                          pricingMode,
                          productId: 'privateCloud',
                          serviceName: this.serviceName,
                        });
                        return childAccumulator + price.value * quantity;
                      },
                      0,
                    ) || 0),
                0,
              ) || 0;

            return {
              ...datacenter,
              displayPrice: this.$translate.instant(
                'dedicatedCloud_datacenters_add_datacenter_new_price',
                {
                  price: `<strong>${this.convertPriceValueToDisplay(
                    totalPrices,
                  )}</strong>`,
                },
              ),
            };
          },
        );
      },
    );
  }

  convertPriceValueToDisplay(value) {
    const priceAsString = new Intl.NumberFormat(
      LANGUAGE_OVERRIDE[this.ovhSubsidiary]
        ? LANGUAGE_OVERRIDE[this.ovhSubsidiary]
        : this.ovhSubsidiary.toLowerCase(),
      {
        style: 'currency',
        currency: this.currency,
        minimumFractionDigits: 2,
      },
    ).format(value);
    return value >= 0 ? `+${priceAsString}` : priceAsString;
  }

  addDatacenter() {
    this.trackClick(
      `datacenter::add-datacenter::confirm_${this.commercialRange.model.name}`,
    );

    this.submitting = true;

    if (this.commercialRange.model.upgradeRequired) {
      return this.goUpgradeRange(
        this.commercialRange.model.name,
        this.commercialRange.model.upgradeCode,
      );
    }

    if (this.commercialRange.model.addons) {
      return this.goToExpressOrder();
    }

    return this.DedicatedCloud.addDatacenter(
      this.serviceName,
      this.commercialRange.model.name,
    ).then(
      () => {
        this.goBack(
          this.$translate.instant('dedicatedCloud_datacenters_adding_success'),
        );
      },
      (data) => {
        this.goBack(
          `${this.$translate.instant(
            'dedicatedCloud_datacenters_adding_error',
          )}: ${data.message || ''}`,
          'danger',
        );
      },
    );
  }

  goToExpressOrder() {
    this.$window.open(
      `${this.expressOrderUrl}?products=${JSURL.stringify(
        this.commercialRange.model.addons,
      )}`,
      '_blank',
      'noopener',
    );
    return this.goBack();
  }

  onCancel() {
    this.trackClick('datacenter::add-datacenter::cancel');
    return this.goBack();
  }
}
