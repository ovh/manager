import find from 'lodash/find';
import lowerCase from 'lodash/lowerCase';
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
    this.currentServicePack = find(this.servicePacksWithPrices, {
      name: this.currentService.servicePackName,
    });

    if (!this.servicePackToOrder) {
      this.servicePackToOrder = this.currentServicePack;
    }

    this.orderableServicePacks = sortBy(
      this.orderableServicePacks.map((servicePack) => {
        const servicePackToDisplay = find(this.servicePacksWithPrices, {
          name: servicePack.name,
        });
        return {
          ...servicePackToDisplay,
          isActive: this.currentServicePack.name === servicePackToDisplay.name,
          prices: {
            hourly: Selection.computeRelativePrice(
              'hourly',
              this.currentServicePack,
              servicePackToDisplay,
              this.currentUser,
            ),
            monthly: Selection.computeRelativePrice(
              'monthly',
              this.currentServicePack,
              servicePackToDisplay,
              this.currentUser,
            ),
          },
        };
      }),
      'name',
    );
  }

  static computeRelativePrice(
    duration,
    currentServicePack,
    servicePackToDisplay,
    currentUser,
  ) {
    if (
      !currentServicePack.price[duration] ||
      !servicePackToDisplay.price[duration]
    ) {
      return {
        exists: false,
      };
    }

    const value =
      servicePackToDisplay.price[duration] - currentServicePack.price[duration];
    const display = Selection.convertPriceValueToDisplay(
      value,
      currentServicePack.price.currencyCode,
      currentUser,
    );

    return {
      exists: true,
      display,
      value,
    };
  }

  static convertPriceValueToDisplay(value, currency, currentUser) {
    const priceAsString = new Intl.NumberFormat(
      lowerCase(currentUser.ovhSubsidiary),
      {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
      },
    ).format(value);
    return value >= 0 ? `+${priceAsString}` : priceAsString;
  }

  onChangeServicePackPicker(selectedItem) {
    this.servicePackToOrder = selectedItem;
  }
}
