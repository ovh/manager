import omit from 'lodash/omit';

export default class IpLoadBalancerServerEditCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $stateParams,
    CucCloudMessage,
    CucControllerHelper,
    IpLoadBalancerConstant,
    IpLoadBalancerServerService,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.CucCloudMessage = CucCloudMessage;
    this.CucControllerHelper = CucControllerHelper;
    this.IpLoadBalancerConstant = IpLoadBalancerConstant;
    this.IpLoadBalancerServerService = IpLoadBalancerServerService;

    this.initLoaders();
  }

  initLoaders() {
    this.farmTypeLoader = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.IpLoadBalancerServerService.getFarmType(
          this.$stateParams.serviceName,
          this.$stateParams.farmId,
        )
          .then((type) => {
            this.farmType = type;
          })
          .catch((err) => {
            if (err === 'NOTFOUND') {
              return this.$state.go('iplb.detail.server-farm');
            }
            return this.CucServiceHelper.errorHandler(
              'iplb_server_request_error',
            );
          }),
    });

    this.proxyProtocolVersions = this.CucControllerHelper.request.getArrayLoader(
      {
        loaderFunction: () =>
          this.IpLoadBalancerServerService.getProxyProtocolVersions(
            this.$stateParams.serviceName,
          ),
      },
    );

    this.apiServer = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.IpLoadBalancerServerService.getServer(
          this.$stateParams.serviceName,
          this.$stateParams.farmId,
          this.$stateParams.serverId,
        ).then((server) => this.parseServer(server)),
    });
  }

  $onInit() {
    this.server = {
      backup: false,
      probe: false,
      ssl: false,
      status: 'active',
    };
    this.portLimit = this.IpLoadBalancerConstant.portLimit;
    this.lbWeightMax = this.IpLoadBalancerConstant.lbWeightMax;

    this.farmTypeLoader.load();
    this.proxyProtocolVersions.load();

    if (this.$stateParams.serverId) {
      this.edition = true;
      this.apiServer.load();
    }
  }

  parseServer(server) {
    this.server = angular.copy(server);
    ['backup', 'probe', 'ssl'].forEach((property) => {
      if (this.server[property] === null) {
        this.server[property] = false;
      }
    });
  }

  getCleanServer() {
    if (this.farmType === 'udp') {
      return omit(this.server, [
        'ssl',
        'cookie',
        'chain',
        'weight',
        'backup',
        'probe',
      ]);
    }
    delete this.server.serverState;
    return this.server;
  }

  create() {
    if (this.form.$invalid) {
      return this.$q.reject();
    }
    this.saving = true;
    this.CucCloudMessage.flushChildMessage();
    return this.IpLoadBalancerServerService.create(
      this.farmType,
      this.$stateParams.serviceName,
      this.$stateParams.farmId,
      this.getCleanServer(),
    )
      .then(() => {
        this.$state.go('iplb.detail.server-farm');
      })

      .finally(() => {
        this.saving = false;
      });
  }

  update() {
    if (this.form.$invalid) {
      return this.$q.reject();
    }
    this.saving = true;
    this.CucCloudMessage.flushChildMessage();
    return this.IpLoadBalancerServerService.update(
      this.farmType,
      this.$stateParams.serviceName,
      this.$stateParams.farmId,
      this.server.serverId,
      this.getCleanServer(),
    )
      .then(() => {
        this.$state.go('iplb.detail.server-farm');
      })
      .finally(() => {
        this.saving = false;
      });
  }
}
