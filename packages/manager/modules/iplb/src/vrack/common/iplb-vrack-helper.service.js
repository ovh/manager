import assignIn from 'lodash/assignIn';
import set from 'lodash/set';

export default class IpLoadBalancerVrackHelper {
  /* @ngInject */
  constructor(CucCloudPoll, IpLoadBalancerVrackService, OvhApiVrack) {
    this.CucCloudPoll = CucCloudPoll;
    this.IpLoadBalancerVrackService = IpLoadBalancerVrackService;
    this.OvhApiVrack = OvhApiVrack;
  }

  associateVrack(serviceName, networkId, vrackCreationRules) {
    this.IpLoadBalancerVrackService.associateVrack(serviceName, networkId)
      .then((task) => {
        set(vrackCreationRules, 'status', 'activating');
        return this.pollCreationRules(task);
      })
      .then(() => this.IpLoadBalancerVrackService
        .getNetworkCreationRules(serviceName, { resetCache: true }))
      .then((creationRules) => {
        assignIn(vrackCreationRules, creationRules);
      });
  }

  deAssociateVrack(serviceName, vrackCreationRules) {
    this.IpLoadBalancerVrackService.deAssociateVrack(serviceName)
      .then((task) => {
        set(vrackCreationRules, 'status', 'deactivating');
        return this.pollCreationRules(task);
      })
      .then(() => this.IpLoadBalancerVrackService
        .getNetworkCreationRules(serviceName, { resetCache: true }))
      .then((creationRules) => {
        assignIn(vrackCreationRules, creationRules);
      });
  }

  pollCreationRules(task) {
    return this.CucCloudPoll.poll({
      item: task,
      pollFunction: () => this.OvhApiVrack.v6()
        .task({ serviceName: task.serviceName, taskId: task.id })
        .$promise
        .catch(() => ({ status: 'done' })),
      stopCondition: item => item.status === 'done' || item.status === 'error',
    }).$promise;
  }
}
