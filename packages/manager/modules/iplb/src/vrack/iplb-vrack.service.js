import forEach from 'lodash/forEach';
import map from 'lodash/map';
import omit from 'lodash/omit';
import set from 'lodash/set';

export default class IpLoadBalancerVrackService {
  /* @ngInject */
  constructor($q, IpLoadBalancerServerFarmService, OvhApiIpLoadBalancing,
    IpLoadBalancerTaskService, OvhApiVrack,
    CucCloudPoll, CucServiceHelper) {
    this.$q = $q;
    this.IpLoadBalancerServerFarmService = IpLoadBalancerServerFarmService;
    this.IpLoadBalancerTaskService = IpLoadBalancerTaskService;
    this.OvhApiIpLoadBalancing = OvhApiIpLoadBalancing;
    this.OvhApiVrack = OvhApiVrack;
    this.CucCloudPoll = CucCloudPoll;
    this.CucServiceHelper = CucServiceHelper;
  }

  associateVrack(serviceName, vrackName) {
    return this.OvhApiVrack.IpLoadBalancing().v6().create({
      serviceName: vrackName,
    }, {
      ipLoadbalancing: serviceName,
    })
      .$promise
      .then(task => task.data)
      .catch(this.CucServiceHelper.errorHandler('iplb_vrack_associate_vrack_error'));
  }

  deAssociateVrack(serviceName) {
    return this.OvhApiIpLoadBalancing.Vrack().v6().getCreationRules({ serviceName }, {})
      .$promise
      .then(response => this.OvhApiVrack.IpLoadBalancing().v6().delete({
        serviceName: response.vrackName,
        ipLoadbalancing: serviceName,
      }).$promise)
      .then(task => task.data)
      .catch(this.CucServiceHelper.errorHandler('iplb_vrack_deassociate_vrack_error'));
  }

  getNetworkCreationRules(serviceName, config = { resetCache: false }) {
    if (config.resetCache) {
      this.OvhApiIpLoadBalancing.Vrack().v6().resetCache();
    }

    return this.OvhApiIpLoadBalancing.Vrack().v6().getStatus({ serviceName }, {})
      .$promise
      .then((response) => {
        const promises = {
          vrackStatus: this.$q.when(response),
          vrack: response.state === 'active' ? this.OvhApiVrack.v6().get({ serviceName: response.vrackName }).$promise : this.$q.when({}),
          iplb: this.OvhApiIpLoadBalancing.v6().get({ serviceName }).$promise,
          rules: response.state === 'active' ? this.OvhApiIpLoadBalancing.Vrack().v6().getCreationRules({ serviceName }, {}).$promise : this.$q.when({}),
        };
        return this.$q.all(promises);
      })
      .then(response => ({
        networkId: response.vrackStatus.vrackName,
        remainingNetworks: response.rules.remainingNetworks,
        minNatIps: response.rules.minNatIps,
        status: response.vrackStatus.state,
        displayName: response.vrack.name || response.vrackStatus.vrackName,
        vrackEligibility: response.iplb.vrackEligibility,
        tasks: response.vrackStatus.task,
      }))
      .catch(this.CucServiceHelper.errorHandler('iplb_vrack_rules_loading_error'));
  }

  pollNetworkTask(serviceName, tasks) {
    const tasksObject = map(tasks, task => ({ id: task }));
    return this.CucCloudPoll.pollArray({
      items: tasksObject,
      pollFunction: task => this.IpLoadBalancerTaskService.getTask(serviceName, task.id)
        .catch(() => ({ status: 'done' })),
      stopCondition: item => item.status === 'done' || item.status === 'error',
    });
  }

  getPrivateNetworks(serviceName) {
    return this.OvhApiIpLoadBalancing.Vrack().v6().query({ serviceName })
      .$promise
      .then((response) => {
        const promises = map(
          response,
          networkId => this.getPrivateNetwork(serviceName, networkId),
        );
        return this.$q.all(promises);
      })
      .then((response) => {
        forEach(response, (privateNetwork) => {
          this.IpLoadBalancerServerFarmService
            .getServerFarms(serviceName, privateNetwork.vrackNetworkId)
            .then((farms) => {
              set(privateNetwork, 'farmId', farms);
            });

          set(privateNetwork, 'farmId', []);
        });

        return response;
      })
      .catch(this.CucServiceHelper.errorHandler('iplb_vrack_private_networks_loading_error'));
  }

  getPrivateNetworkFarms(serviceName, networkId) {
    return this.getPrivateNetwork(serviceName, networkId)
      .then(privateNetwork => this.IpLoadBalancerServerFarmService
        .getServerFarms(serviceName, privateNetwork.vrackNetworkId));
  }

  addPrivateNetwork(serviceName, network) {
    return this.OvhApiIpLoadBalancing.Vrack().v6().post({ serviceName }, omit(network, ['vrackNetworkId', 'farmId']))
      .$promise
      .then(response => this.OvhApiIpLoadBalancing.Vrack().v6()
        .updateFarmId({
          serviceName,
          vrackNetworkId: response.vrackNetworkId,
        }, { farmId: network.farmId }).$promise)
      .then((response) => {
        this.OvhApiIpLoadBalancing.Farm().v6().resetQueryCache();
        this.OvhApiIpLoadBalancing.Farm().Tcp().v6().resetCache();
        this.OvhApiIpLoadBalancing.Farm().Udp().v6().resetCache();
        this.OvhApiIpLoadBalancing.Farm().Http().v6().resetCache();
        return response;
      })
      .then(() => this.CucServiceHelper.successHandler('iplb_vrack_private_network_add_success')())
      .catch(this.CucServiceHelper.errorHandler('iplb_vrack_private_network_add_error'));
  }

  editPrivateNetwork(serviceName, network) {
    return this.$q.all([
      this.OvhApiIpLoadBalancing.Vrack().v6().put({ serviceName, vrackNetworkId: network.vrackNetworkId }, omit(network, ['vrackNetworkId', 'farmId'])).$promise,
      this.OvhApiIpLoadBalancing.Vrack().v6()
        .updateFarmId({
          serviceName,
          vrackNetworkId: network.vrackNetworkId,
        }, { farmId: network.farmId }).$promise,
    ])
      .then((response) => {
        this.OvhApiIpLoadBalancing.Farm().v6().resetQueryCache();
        this.OvhApiIpLoadBalancing.Farm().Tcp().v6().resetCache();
        this.OvhApiIpLoadBalancing.Farm().Udp().v6().resetCache();
        this.OvhApiIpLoadBalancing.Farm().Http().v6().resetCache();
        return response;
      })
      .then(() => this.CucServiceHelper.successHandler('iplb_vrack_private_network_edit_success')())
      .catch(this.CucServiceHelper.errorHandler('iplb_vrack_private_network_edit_error'));
  }

  deletePrivateNetwork(serviceName, networkId) {
    return this.OvhApiIpLoadBalancing.Vrack().v6()
      .updateFarmId({ serviceName, vrackNetworkId: networkId }, { farmId: [] }).$promise
      .then(() => this.OvhApiIpLoadBalancing.Vrack().v6()
        .delete({ serviceName, vrackNetworkId: networkId }).$promise)
      .then(() => this.CucServiceHelper.successHandler('iplb_vrack_private_network_delete_success')())
      .catch(this.CucServiceHelper.errorHandler('iplb_vrack_private_network_delete_error'));
  }

  getPrivateNetwork(serviceName, networkId) {
    return this.OvhApiIpLoadBalancing.Vrack().v6().get({ serviceName, vrackNetworkId: networkId })
      .$promise
      .then((response) => {
        response.displayName = response.displayName || response.vrackNetworkId;
        return response;
      })
      .catch(this.CucServiceHelper.errorHandler('iplb_vrack_private_network_loading_error'));
  }
}
