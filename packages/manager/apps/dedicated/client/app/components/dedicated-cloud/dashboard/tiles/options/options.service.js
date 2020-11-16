import filter from 'lodash/filter';
import get from 'lodash/get';
import find from 'lodash/find';
import reject from 'lodash/reject';

import { DELIVERY_STATUS } from '../../../service-pack/service-pack.constants';

import optionsOrderService from './models/order/order.service';
import optionsUserService from './models/user/user.service';
import servicePackService from '../../../service-pack/service-pack.service';

import {
  OPTIONS,
  OPTION_TYPES,
} from '../../../service-pack/option/option.constants';

import { ORDER_STATUS } from './options.constants';

const moduleName = 'ovhManagerPccDashboardOptionsService';
export const name = 'ovhManagerPccDashboardOptionsService';

const OptionsService = class OptionsService {
  /* @ngInject */
  constructor(
    $q,
    OvhApiDedicatedCloud,
    ovhManagerPccDashboardOptionsOrderService,
    ovhManagerPccDashboardOptionsUserService,
    ovhManagerPccServicePackService,
  ) {
    this.$q = $q;
    this.OvhApiDedicatedCloud = OvhApiDedicatedCloud;
    this.ovhManagerPccDashboardOptionsOrderService = ovhManagerPccDashboardOptionsOrderService;
    this.ovhManagerPccDashboardOptionsUserService = ovhManagerPccDashboardOptionsUserService;
    this.ovhManagerPccServicePackService = ovhManagerPccServicePackService;
  }

  static computeServicePackCurrent(
    allServicePacks,
    computedPendingOrder,
    currentServicePackName,
  ) {
    const matchingServicePack = find(allServicePacks, {
      name:
        (computedPendingOrder.exists &&
          computedPendingOrder.nameOfServicePackBeforeOrder) ||
        currentServicePackName,
    });

    if (computedPendingOrder.isInitialOrder) {
      matchingServicePack.certification = { exists: false };
    }

    return matchingServicePack;
  }

  static computeServicePacksOrderable(
    allServicePacks,
    currentServicePackName,
    orderedServicePackName,
  ) {
    // all service packs are orderable except the current one
    const orderableServicePacks = reject(allServicePacks, {
      name: currentServicePackName,
    });

    return {
      withACertification: reject(
        filter(
          orderableServicePacks,
          (servicePack) => servicePack.certification.exists,
        ),
        { name: orderedServicePackName },
      ),
      withOnlyBasicOptions: reject(
        filter(
          orderableServicePacks,
          (servicePack) => !servicePack.certification.exists,
        ),
        { name: orderedServicePackName },
      ),
    };
  }

  static computeServicePacksOrdered(
    allServicePacks,
    pendingOrder,
    currentOrFutureServicePack,
  ) {
    const matchingServicePackName =
      (pendingOrder && pendingOrder.orderedServicePackName) ||
      (currentOrFutureServicePack.state !== DELIVERY_STATUS.ACTIVE &&
        currentOrFutureServicePack.name);

    const matchingServicePack = find(allServicePacks, {
      name: matchingServicePackName,
    });

    const exists = matchingServicePack != null;

    return {
      ...matchingServicePack,
      exists,
      certification: {
        ...(exists && matchingServicePack.certification),
        exists: exists && matchingServicePack.certification.exists,
      },
      mustBeConfigured:
        currentOrFutureServicePack.state ===
        DELIVERY_STATUS.WAITING_FOR_CUSTOMER,
    };
  }

  static computeOptionsBasic() {
    return filter(OPTIONS, (option) => option.type === OPTION_TYPES.basic);
  }

  getPendingOrder(serviceName) {
    return this.ovhManagerPccDashboardOptionsOrderService.getServicePackOrder(
      serviceName,
    );
  }

  getCurrentOrFutureServicePack(serviceName) {
    this.OvhApiDedicatedCloud.v6().resetCache();

    return this.OvhApiDedicatedCloud.v6().servicePack({ serviceName }).$promise;
  }

  getServicePacks(serviceName, ovhSubsidiary) {
    return this.ovhManagerPccServicePackService.getServicePacksForDashboardOptions(
      serviceName,
      ovhSubsidiary,
    );
  }

  getInitialData(serviceName, ovhSubsidiary, currentServicePackName) {
    return this.$q
      .when(
        this.getPendingOrder(serviceName).then((pendingOrder) =>
          moment(pendingOrder.expirationDate).isBefore(moment())
            ? this.ovhManagerPccDashboardOptionsOrderService.deleteServicePackOrder(
                serviceName,
              )
            : null,
        ),
      )
      .then(() =>
        this.$q.all({
          pendingOrder: this.getPendingOrder(serviceName),
          currentOrFutureServicePack: this.getCurrentOrFutureServicePack(
            serviceName,
          ),
          servicePacks: this.getServicePacks(serviceName, ovhSubsidiary),
        }),
      )
      .then(({ pendingOrder, currentOrFutureServicePack, servicePacks }) => {
        const model = {
          options: {},
          pendingOrder: OptionsService.computePendingOrder(
            pendingOrder,
            currentOrFutureServicePack,
          ),
          servicePacks: {
            all: servicePacks,
          },
        };

        model.options.basic = OptionsService.computeOptionsBasic();

        model.servicePacks.ordered = OptionsService.computeServicePacksOrdered(
          servicePacks,
          model.pendingOrder,
          currentOrFutureServicePack,
        );

        model.servicePacks.current = OptionsService.computeServicePackCurrent(
          servicePacks,
          model.pendingOrder,
          currentServicePackName,
        );

        model.servicePacks.orderable = OptionsService.computeServicePacksOrderable(
          servicePacks,
          get(model.servicePacks.current, 'name'),
          model.pendingOrder.exists &&
            model.pendingOrder.orderedServicePackName,
        );

        if (!model.pendingOrder.exists) {
          this.ovhManagerPccDashboardOptionsOrderService.deleteServicePackOrder(
            serviceName,
          );
        }

        return model;
      });
  }

  static computePendingOrder(pendingOrder, currentOrFutureServicePack) {
    const exists = OptionsService.computePendingOrderExists(
      currentOrFutureServicePack,
      pendingOrder,
    );

    return {
      ...pendingOrder,
      exists,
      isInError: currentOrFutureServicePack.state === DELIVERY_STATUS.ERROR,
      isInitialOrder: !pendingOrder.exists && exists,
      needsConfiguration: OptionsService.computePendingOrderNeedsConfiguration(
        currentOrFutureServicePack,
      ),
      orderedServicePackName:
        exists &&
        (pendingOrder.orderedServicePackName ||
          currentOrFutureServicePack.name),
    };
  }

  static computePendingOrderExists(currentOrFutureServicePack, pendingOrder) {
    return (
      currentOrFutureServicePack.state !== DELIVERY_STATUS.ACTIVE ||
      // tasks can take up to 5 minutes to be created
      (pendingOrder.exists &&
        (pendingOrder.status === ORDER_STATUS.notPaid ||
          moment().isBefore(moment(pendingOrder.date).add(5, 'minutes'))))
    );
  }

  // user ordered through funnel and arrsived before task creation
  static computePendingOrderNeedsConfiguration(currentOrFutureServicePack) {
    return (
      currentOrFutureServicePack.state === DELIVERY_STATUS.WAITING_FOR_CUSTOMER
    );
  }
};

angular
  .module(moduleName, [
    optionsOrderService,
    optionsUserService,
    servicePackService,
  ])
  .service(name, OptionsService);

export default moduleName;
