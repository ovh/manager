import head from 'lodash/head';
import includes from 'lodash/includes';

export default class VpsUpgradeService {
  /* @ngInject */
  constructor($http, CucOvhPoll, VpsTaskService) {
    this.$http = $http;
    this.CucOvhPoll = CucOvhPoll;
    this.VpsTaskService = VpsTaskService;

    this.upgradeTaskPolling = null;
  }

  static getPlanUpgradeParams(plan, autoPayWithPreferredPaymentMethod) {
    const { duration, pricingMode } =
      plan.prices.find(({ capacities = [] }) => capacities.includes('renew')) ||
      {};
    return {
      autoPayWithPreferredPaymentMethod,
      duration,
      pricingMode,
      quantity: 1,
    };
  }

  getAvailableUpgrades(serviceId) {
    return this.$http
      .get(`/services/${serviceId}/upgrade`)
      .then(({ data }) => data);
  }

  getUpgrade(serviceId, plan, autoPayWithPreferredPaymentMethod) {
    return this.$http
      .post(
        `/services/${serviceId}/upgrade/${plan.planCode}/simulate `,
        VpsUpgradeService.getPlanUpgradeParams(
          plan,
          autoPayWithPreferredPaymentMethod,
        ),
      )
      .then(({ data }) => data);
  }

  startUpgrade(serviceId, plan, autoPayWithPreferredPaymentMethod) {
    return this.$http
      .post(
        `/services/${serviceId}/upgrade/${plan.planCode}/execute `,
        VpsUpgradeService.getPlanUpgradeParams(
          plan,
          autoPayWithPreferredPaymentMethod,
        ),
      )
      .then(({ data }) => data);
  }

  getUpgradeTask(serviceName) {
    return this.VpsTaskService.getPendingTasks(
      serviceName,
      'upgradeVm',
    ).then((tasks) => head(tasks));
  }

  stopUpgradeTaskPolling() {
    if (this.upgradeTaskPolling) {
      this.upgradeTaskPolling.kill();
    }
  }

  startUpgradeTaskPolling(serviceName, upgradeTask, options = {}) {
    const fullOptions = {
      pollFunction: (task) => this.VpsTaskService.getTask(serviceName, task.id),
      stopCondition: (task) => includes(['done', 'error'], task.state),
      ...options,
    };

    this.upgradeTaskPolling = this.CucOvhPoll.poll({
      item: upgradeTask,
      ...fullOptions,
    });

    return this.upgradeTaskPolling;
  }
}
