import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';

export default class IpLoadBalancerVrackCtrl {
  /* @ngInject */
  constructor(
    $state,
    $stateParams,
    $translate,
    CucControllerHelper,
    IpLoadBalancerVrackService,
    IpLoadBalancerVrackHelper,
    CucVrackService,
    OvhApiIpLoadBalancing,
  ) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.CucControllerHelper = CucControllerHelper;
    this.IpLoadBalancerVrackService = IpLoadBalancerVrackService;
    this.IpLoadBalancerVrackHelper = IpLoadBalancerVrackHelper;
    this.OvhApiIpLoadBalancing = OvhApiIpLoadBalancing;
    this.VrackService = CucVrackService;

    this.serviceName = $stateParams.serviceName;

    this.initLoaders();
    this.initActions();
  }

  $onInit() {
    this.creationRules.load().then((creationRules) => {
      if (creationRules.tasks.length) {
        this.IpLoadBalancerVrackService.pollNetworkTask(
          this.serviceName,
          creationRules.tasks,
        ).$promise.then(() => {
          this.OvhApiIpLoadBalancing.Vrack()
            .v6()
            .resetCache();
          this.creationRules.load();
        });
      }
    });
    this.privateNetworks.load();
  }

  initLoaders() {
    this.creationRules = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.IpLoadBalancerVrackService.getNetworkCreationRules(
          this.serviceName,
        ),
    });

    this.privateNetworks = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.IpLoadBalancerVrackService.getPrivateNetworks(this.serviceName),
    });
  }

  initActions() {
    this.actions = {
      activateVrack: {
        text: this.$translate.instant('iplb_activate'),
        callback: () =>
          this.VrackService.selectVrack().then((result) =>
            this.IpLoadBalancerVrackHelper.associateVrack(
              this.serviceName,
              result.serviceName,
              this.creationRules.data,
            ),
          ),
        isAvailable: () =>
          !this.creationRules.loading &&
          !this.creationRules.hasErrors &&
          this.creationRules.data.vrackEligibility &&
          this.creationRules.data.status === 'inactive' &&
          isEmpty(this.creationRules.data.tasks),
      },
      deActivateVrack: {
        text: this.$translate.instant('iplb_deactivate'),
        callback: () =>
          this.VrackService.unlinkVrackModal().then(() =>
            this.IpLoadBalancerVrackHelper.deAssociateVrack(
              this.serviceName,
              this.creationRules.data,
            ),
          ),
        isAvailable: () =>
          !this.creationRules.loading &&
          !this.creationRules.hasErrors &&
          this.creationRules.data.status === 'active' &&
          isEmpty(this.creationRules.data.tasks),
      },
      addPrivateNetwork: {
        text: this.$translate.instant('iplb_vrack_private_network_add'),
        callback: () =>
          this.$state.go('iplb.detail.vrack.add', {
            serviceName: this.$stateParams.serviceName,
          }),
        isAvailable: () =>
          !this.creationRules.loading &&
          this.creationRules.data.status === 'active' &&
          this.creationRules.data.remainingNetworks,
      },
      editPrivateNetwork: {
        text: this.$translate.instant('iplb_modify'),
        callback: (network) =>
          this.$state.go('iplb.detail.vrack.dashboard.edit', {
            serviceName: this.serviceName,
            networkId: network.vrackNetworkId,
          }),
        isAvailable: () =>
          !this.creationRules.loading &&
          includes(['active', 'inactive'], this.creationRules.data.status),
      },
      deletePrivateNetwork: {
        text: this.$translate.instant('iplb_delete'),
        callback: (network) =>
          this.CucControllerHelper.modal
            .showDeleteModal({
              titleText: this.$translate.instant(
                'iplb_vrack_private_network_delete_title',
              ),
              text: this.$translate.instant(
                'iplb_vrack_private_network_delete_text',
                { network: network.displayName },
              ),
            })
            .then(() => this.deletePrivateNetwork(network)),
        isAvailable: () =>
          !this.creationRules.loading &&
          includes(['active', 'inactive'], this.creationRules.data.status),
      },
    };
  }

  deletePrivateNetwork(network) {
    return this.IpLoadBalancerVrackService.deletePrivateNetwork(
      this.serviceName,
      network.vrackNetworkId,
    ).then(() => {
      this.creationRules.load();
      this.privateNetworks.load();
    });
  }
}
