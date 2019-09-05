import find from 'lodash/find';
import sortBy from 'lodash/sortBy';

import { OPTION_TYPES } from '../../../servicePack/option/option.constants';

import {
  MODAL_CONTROLLER_NAME,
  MODAL_TEMPLATE_URL,
} from './constants';

export default class {
  /* @ngInject */
  constructor(
    $state,
    $translate,
    $uibModal,
    Alerter,
    OvhApiOrder,
    ovhManagerPccServicePackService,
  ) {
    this.$state = $state;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
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
          const matchingServicePack = find(this.servicePacksWithPrices, {
            name: servicePack.name,
          });
          const priceAsNumber = matchingServicePack.price.value - currentServicePack.price.value;

          const priceAsString = new Intl
            .NumberFormat(
              'fr', // can't change as the API is not ISO compliant
              {
                style: 'currency',
                currency: currentServicePack.price.currencyCode,
                minimumFractionDigits: 2,
              },
            )
            .format(priceAsNumber);

          const price = priceAsNumber > 0 ? `+${priceAsString}` : priceAsString;

          return {
            ...servicePack,
            price,
            priceAsNumber,
          };
        }),
      'name',
    );
  }

  selectServicePackToOrder() {
    this.servicePackToOrder = find(
      this.orderableServicePacks,
      { name: this.nameOfServicePackToOrder },
    );
  }

  confirmOrder() {
    return this.form.$valid
      ? this.$uibModal
        .open({
          templateUrl: MODAL_TEMPLATE_URL,
          controller: MODAL_CONTROLLER_NAME,
          controllerAs: '$ctrl',
          resolve: {
            itemName: () => this.servicePackToOrder.displayName,
            itemType: () => this.activationType,
            price: () => this.servicePackToOrder.price.replace(/\+/g, ''),
            priceAsNumber: () => this.servicePackToOrder.priceAsNumber,
          },
        }).result
        .then(() => this.placeOrder())
      : this.$q.when();
  }

  goToNextStep() {
    if (this.form.$invalid) {
      return this.$q.when();
    }

    return this.stepper.goToNextStep({
      currentService: this.currentService,
      servicePackToOrder: this.servicePackToOrder,
    });
  }

  placeOrder() {
    if (this.form.$invalid) {
      return this.$q.when();
    }

    this.orderIsInProgress = true;

    return this.OvhApiOrder.Upgrade().PrivateCloud().v6()
      .post({
        serviceName: `${this.currentService.serviceName}/servicepack`,
        planCode: `pcc-servicepack-${this.servicePackToOrder.name}`,
        quantity: 1,
        autoPayWithPreferredPaymentMethod: this.hasDefaultMeansOfPayment,
      }).$promise
      .then(({ order }) => {
        this.orderingURL = order.url;

        return this.ovhManagerPccServicePackService
          .savePendingOrder(this.currentService.serviceName, {
            activationType: this.activationType,
            id: order.orderId,
            needsConfiguration: this.activationType === OPTION_TYPES.certification,
            orderedServicePackName: this.servicePackToOrder.name,
            url: order.url,
          })
          .then(() => (this.hasDefaultMeansOfPayment
            ? this.goToNextStep()
            : null));
      })
      .catch(error => this.stepper
        .exit()
        .then(() => this.Alerter
          .alertFromSWS(this.$translate
            .instant('dedicatedCloudDashboardTilesOptionsOrderSelection_order_failure'), {
            message: error.data.message,
            type: 'ERROR',
          }, 'dedicatedCloud_alert')))
      .finally(() => {
        this.orderIsInProgress = false;
      });
  }
}
