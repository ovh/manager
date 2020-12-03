import endsWith from 'lodash/endsWith';
import find from 'lodash/find';
import get from 'lodash/get';
import last from 'lodash/last';
import split from 'lodash/split';

import {
  CONTROLLER_NAME as CONFIRM_CONTROLLER_NAME,
  TEMPLATE_CACHE_KEY as CONFIRM_TEMPLATE_CACHE_KEY,
} from './confirm/confirm.constants';
import { NAVIGATION } from '../../../../../stepper/step/step.constants';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $translate,
    $uibModal,
    Alerter,
    OvhApiOrder,
    OvhApiServices,
    servicePackUpgradePreferenceService,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.Alerter = Alerter;
    this.OvhApiOrder = OvhApiOrder;
    this.OvhApiServices = OvhApiServices;
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
    const serviceName = `${this.currentService.serviceName}/servicepack`;
    const productName = `pcc-servicepack-${this.servicePackToOrder.name}`;
    return this.OvhApiServices.v6()
      .query()
      .$promise.then((services) => {
        let planCode = productName;
        const currentService = find(services, (service) =>
          find(get(service, 'route.vars'), {
            value: this.currentService.serviceName,
            key: 'serviceName',
          }),
        );
        const currentServicePlanCode = get(currentService, 'billing.plan.code');
        if (
          endsWith(currentServicePlanCode, 'eu') ||
          endsWith(currentServicePlanCode, 'ca')
        ) {
          planCode = `${planCode}_${last(split(currentServicePlanCode, '_'))}`;
        }
        return this.OvhApiOrder.Upgrade()
          .PrivateCloud()
          .v6()
          .post({
            serviceName,
            planCode,
            quantity: 1,
            autoPayWithPreferredPaymentMethod: this.hasDefaultMeansOfPayment,
          }).$promise;
      });
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
