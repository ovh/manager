import map from 'lodash/map';
import set from 'lodash/set';

export default class IpLoadBalancerTaskService {
  /* @ngInject */
  constructor($q, $translate, OvhApiIpLoadBalancing, CucServiceHelper) {
    this.$q = $q;
    this.$translate = $translate;
    this.IpLoadBalancing = OvhApiIpLoadBalancing;
    this.CucServiceHelper = CucServiceHelper;
  }

  getTasks(serviceName) {
    return this.IpLoadBalancing.Task().v6().query({ serviceName })
      .$promise
      .then((response) => {
        const promises = map(response, taskId => this.getTask(serviceName, taskId));
        return this.$q.all(promises);
      })
      .catch(this.CucServiceHelper.errorHandler('iplb_task_list_loading_error'));
  }

  getTask(serviceName, taskId) {
    return this.IpLoadBalancing.Task().v6().get({ serviceName, taskId })
      .$promise
      .then(task => set(task, 'creationDateFormated', moment(task.creationDate).format('LLL')));
  }
}
