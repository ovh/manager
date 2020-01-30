import reduce from 'lodash/reduce';

export const name = 'ovhManagerPccDashboardOptionsOrderService';

export const OptionsService = class {
  /* @ngInject */
  constructor($q, OvhApiMe, servicePackUpgradePreferenceService, ovhUserPref) {
    this.$q = $q;
    this.OvhApiMe = OvhApiMe;
    this.servicePackUpgradePreferenceService = servicePackUpgradePreferenceService;
    this.ovhUserPref = ovhUserPref;
  }

  getOrderWithStatus(orderId) {
    const mergeOrderAndItsStatus = (array) =>
      reduce(
        array,
        (accumulator, current) => ({ ...accumulator, ...current }),
        {},
      );

    return this.$q
      .all([
        this.OvhApiMe.Order()
          .v6()
          .get({ orderId }).$promise,
        this.OvhApiMe.Order()
          .v6()
          .getStatus({ orderId }).$promise,
      ])
      .then(mergeOrderAndItsStatus);
  }

  // This uses async/await as it's way easier to understand this way
  async getServicePackOrder(serviceName) {
    const preferenceExists = await this.servicePackUpgradePreferenceService.doesPreferenceExists(
      serviceName,
    );

    if (!preferenceExists) {
      return { exists: false };
    }

    const preference = await this.servicePackUpgradePreferenceService.getPreferenceForService(
      serviceName,
    );

    try {
      const order = await this.getOrderWithStatus(preference.id);

      return {
        exists: true,
        ...preference,
        ...order,
      };
    } catch (error) {
      if (error.status === 404) {
        return {
          exists: false,
        };
      }

      throw error;
    }
  }

  async deleteServicePackOrder(serviceName) {
    const preferenceExists = await this.servicePackUpgradePreferenceService.doesPreferenceExists(
      serviceName,
    );

    if (preferenceExists) {
      this.servicePackUpgradePreferenceService.removePreference(serviceName);
    }

    return null;
  }
};

export default {
  name,
  OptionsService,
};
