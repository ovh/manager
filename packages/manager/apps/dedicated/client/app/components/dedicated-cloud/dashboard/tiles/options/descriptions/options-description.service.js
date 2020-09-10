import get from 'lodash/get';

import config from '../../../../../../config/config';

import { ACTIVATION_STATUS } from '../components/activation-status/activation-status.constants';
import { ORDER_STATUS } from '../options.constants';

const moduleName = 'ovhManagerPccDashboardOptionsDescriptionService';

class OptionsDescriptionsService {
  static computePresentationUrl(ovhSubsidiary, optionName) {
    const urls = config.constants.URLS;
    return get(urls, ovhSubsidiary, urls.FR).presentations[optionName];
  }

  static computeStatus(
    currentServicePackHasOption,
    orderedServicePackHasOption,
    pendingOrder,
  ) {
    // If there is no pending order
    if (!pendingOrder.exists) {
      return currentServicePackHasOption
        ? ACTIVATION_STATUS.enabled
        : ACTIVATION_STATUS.disabled;
    }

    if (pendingOrder.isInError) {
      return ACTIVATION_STATUS.inError;
    }

    // If there is a pending order

    // If it's an order from the order funnel (not an upgrade from the Manager)
    if (pendingOrder.needsConfiguration) {
      return ACTIVATION_STATUS.needsConfiguration;
    }

    // If the API doesn't know the status of the pending order
    if (pendingOrder.status === ORDER_STATUS.unknown) {
      return ACTIVATION_STATUS.unknown;
    }

    // If the API knows the status of the pending order

    // - The current service pack already has the option
    // - The ordered service pack will have it too
    if (currentServicePackHasOption && orderedServicePackHasOption) {
      return ACTIVATION_STATUS.enabled;
    }

    // - The current service pack doesn't have the option
    // - The ordered service pack won't have it too
    if (!currentServicePackHasOption && !orderedServicePackHasOption) {
      return ACTIVATION_STATUS.disabled;
    }

    // The option will either:
    // - be installed
    // - be uninstalled
    //
    // If the current service pack doesn't have the option, then it will be installed
    const willBeInstalled = !currentServicePackHasOption;

    if (
      [ORDER_STATUS.documentsRequested, ORDER_STATUS.notPaid].includes(
        pendingOrder.status,
      )
    ) {
      return ACTIVATION_STATUS.awaitingValidation;
    }

    if ([ORDER_STATUS.cancelling].includes(pendingOrder.status)) {
      return ACTIVATION_STATUS.cancelling;
    }

    if (
      [
        ORDER_STATUS.checking,
        ORDER_STATUS.delivered,
        ORDER_STATUS.delivering,
      ].includes(pendingOrder.status)
    ) {
      return willBeInstalled
        ? ACTIVATION_STATUS.beingActivated
        : ACTIVATION_STATUS.beingDeactivated;
    }

    return ACTIVATION_STATUS.beingActivated;
  }
}

angular
  .module(moduleName, [])
  .service(
    'ovhManagerPccDashboardOptionsDescriptionService',
    OptionsDescriptionsService,
  );

export default moduleName;
