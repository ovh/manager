import {
  CONTROLLER_NAME as CONFIRM_CONTROLLER_NAME,
  TEMPLATE_CACHE_KEY as CONFIRM_TEMPLATE_CACHE_KEY,
} from './confirm/confirm.constants';
import { NAVIGATION } from '../../../../../stepper/step/step.constants';

export default class {
  /* @ngInject */
  constructor(
    $http,
    $q,
    $scope,
    $translate,
    $uibModal,
    Alerter,
    OvhApiOrder,
    servicePackUpgradePreferenceService,
  ) {
    this.$http = $http;
    this.$q = $q;
    this.$scope = $scope;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.Alerter = Alerter;
    this.OvhApiOrder = OvhApiOrder;
    this.servicePackUpgradePreferenceService = servicePackUpgradePreferenceService;
  }

  $onInit() {
    this.bindings = {
      isLoading: true,
    };

    return this.handleInitialData().finally(() => {
      this.$scope.$apply();
    });
  }

  async handleInitialData() {
    try {
      await this.$uibModal.open({
        templateUrl: CONFIRM_TEMPLATE_CACHE_KEY,
        controller: CONFIRM_CONTROLLER_NAME,
        controllerAs: '$ctrl',
        resolve: {
          hasDefaultMeansOfPayment: () => this.hasDefaultMeansOfPayment,
          itemName: () => this.servicePackToOrder.displayName,
          itemRef: () => this.servicePackToOrder.name,
          itemType: () => this.activationType,
          prices: () => this.servicePackToOrder.prices,
        },
      }).result;
    } catch (error) {
      return this.stepper.goToStep(NAVIGATION.PREVIOUS_STEP);
    }

    try {
      const { order } = await this.placeOrder();
      this.order = order;
      this.bindings.orderUrl = order.url;
      await this.savePreference();

      if (this.hasDefaultMeansOfPayment) {
        if (this.stepper.doesStepExist(NAVIGATION.NEXT_STEP)) {
          return this.stepper.goToStep(NAVIGATION.NEXT_STEP);
        }

        return this.stepper.close();
      }

      this.bindings.isLoading = false;
    } catch (error) {
      this.Alerter.alertFromSWS(
        this.$translate.instant(
          'ovhManagerPccServicePackUpgradePlaceOrder_error',
        ),
        {
          ...error.data,
          type: 'ERROR',
        },
      );

      return this.stepper.close();
    }

    return null;
  }

  placeOrder() {
    let serviceId;
    return this.$http
      .get(`/services/${this.currentService.serviceInfos.serviceId}/options`)
      .then(({ data }) => {
        serviceId = data.find(
          (option) =>
            option.resource?.name ===
            `${this.currentService.serviceName}/servicepack`,
        )?.serviceId;
        return this.$http.get(
          `/services/${serviceId}/upgrade/pcc-servicepack-${this.servicePackToOrder.name}`,
        );
      })
      .then(({ data }) => {
        const renewPrice = data.prices?.find((price) =>
          price.capacities.includes('renew'),
        );
        return this.$http.post(
          `/services/${serviceId}/upgrade/pcc-servicepack-${this.servicePackToOrder.name}/execute`,
          {
            pricingMode: renewPrice?.pricingMode,
            duration: renewPrice?.duration,
            autoPayWithPreferredPaymentMethod: this.hasDefaultMeansOfPayment,
            quantity: 1,
          },
        );
      })
      .then(({ data }) => data);
  }

  savePreference() {
    return this.servicePackUpgradePreferenceService.savePreference(
      this.currentService.serviceName,
      {
        activationType: this.activationType,
        hasBeenPaid: this.hasDefaultMeansOfPayment,
        id: this.order.orderId,
        nameOfServicePackBeforeOrder: this.currentService.servicePackName,
        orderedServicePackName: this.servicePackToOrder.name,
        url: this.order.url,
      },
    );
  }
}
