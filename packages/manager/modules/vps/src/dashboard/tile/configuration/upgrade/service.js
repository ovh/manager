import head from 'lodash/head';
import includes from 'lodash/includes';

export default class VpsUpgradeService {
  /* @ngInject */
  constructor($http, CucOvhPoll, VpsTaskService) {
    this.$http = $http;
    this.CucOvhPoll = CucOvhPoll;
    this.VpsTaskService = VpsTaskService;
  }

  getAvailableUpgrades(serviceName) {
    return this.$http
      .get(`/order/upgrade/vps/${serviceName}`)
      .then(({ data }) => data);
  }

  getUpgrade(serviceName, planCode, params) {
    return this.$http
      .get(`/order/upgrade/vps/${serviceName}/${planCode}`, {
        params,
      })
      .then(({ data }) => data);
  }

  startUpgrade(serviceName, planCode, httpData) {
    return this.$http
      .post(`/order/upgrade/vps/${serviceName}/${planCode}`, {
        data: httpData,
      })
      .then(({ data }) => data);
  }

  getUpgradeTask(serviceName) {
    return this.VpsTaskService.getPendingTasks(
      serviceName,
      'upgradeVm',
    ).then((tasks) => head(tasks));
  }

  startUpgradeTaskPolling(upgradeTask, options = {}) {
    const fullOptions = {
      pollFunction: (task) =>
        this.VpsTaskService.getTask(this.serviceName, task.id),
      stopCondition: (task) => includes(['done', 'error'], task.state),
      ...options,
    };

    return this.CucOvhPoll.poll({ item: upgradeTask, ...fullOptions });
  }
}
