import find from 'lodash/find';
import sortBy from 'lodash/sortBy';

export default class Selection {
  /* @ngInject */
  constructor(
    $state,
    $translate,
    Alerter,
    OvhApiOrder,
    ovhManagerPccServicePackService,
  ) {
    this.$state = $state;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.OvhApiOrder = OvhApiOrder;
    this.ovhManagerPccServicePackService = ovhManagerPccServicePackService;
  }

  $onInit() {
    const currentServicePack = find(
      this.servicePacksWithPrices,
      { name: this.currentService.servicePackName },
    );

    this.orderableServicePacks = sortBy(
      this.orderableServicePacks
        .map((servicePack) => {
          const servicePackToDisplay = find(
            this.servicePacksWithPrices,
            {
              name: servicePack.name,
            },
          );

          return {
            ...servicePack,
            prices: {
              hourly: Selection.computeRelativePrice('hourly', currentServicePack, servicePackToDisplay),
              monthly: Selection.computeRelativePrice('monthly', currentServicePack, servicePackToDisplay),
            },
          };
        }),
      'name',
    );
  }

  static computeRelativePrice(duration, currentServicePack, servicePackToDisplay) {
    if (!currentServicePack.price[duration]
        || !servicePackToDisplay.price[duration]) {
      return {
        exists: false,
      };
    }

    const value = servicePackToDisplay.price[duration]
            - currentServicePack.price[duration];
    const display = Selection.convertPriceValueToDisplay(
      value,
      currentServicePack.price.currencyCode,
    );

    return {
      exists: true,
      display,
      value,
    };
  }

  static convertPriceValueToDisplay(value, currency) {
    const priceAsString = new Intl
      .NumberFormat(
        'fr', // can't change as the API is not ISO compliant
        {
          style: 'currency',
          currency,
          minimumFractionDigits: 2,
        },
      )
      .format(value);

    return value > 0 ? `+${priceAsString}` : priceAsString;
  }

  onChangeServicePackPicker(selectedItem) {
    this.servicePackToOrder = selectedItem;
  }
}
