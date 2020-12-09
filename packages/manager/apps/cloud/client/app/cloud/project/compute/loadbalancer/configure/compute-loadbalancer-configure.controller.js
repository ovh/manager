import filter from 'lodash/filter';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import includes from 'lodash/includes';
import mapValues from 'lodash/mapValues';
import reduce from 'lodash/reduce';
import values from 'lodash/values';

class CloudProjectComputeLoadbalancerConfigureCtrl {
  constructor(
    $anchorScroll,
    $scope,
    $state,
    $stateParams,
    $q,
    $location,
    $window,
    $translate,
    CloudProjectComputeLoadbalancerService,
    OvhApiIpLoadBalancing,
    OvhApiCloudProjectIplb,
    OvhApiCloudProject,
    ovhDocUrl,
    CucCloudMessage,
    IpLoadBalancerTaskService,
    CucControllerHelper,
    CucCloudPoll,
    CucServiceHelper,
  ) {
    this.$anchorScroll = $anchorScroll;
    this.$scope = $scope;
    this.$state = $state;
    this.$q = $q;
    this.$location = $location;
    this.$window = $window;
    this.$translate = $translate;
    this.CloudProjectComputeLoadbalancerService = CloudProjectComputeLoadbalancerService;
    this.OvhApiIpLoadBalancing = OvhApiIpLoadBalancing;
    this.OvhApiCloudProjectIplb = OvhApiCloudProjectIplb;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.ovhDocUrl = ovhDocUrl;
    this.CucCloudMessage = CucCloudMessage;
    this.IpLoadBalancerTaskService = IpLoadBalancerTaskService;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudPoll = CucCloudPoll;
    this.CucServiceHelper = CucServiceHelper;

    this.serviceName = $stateParams.projectId;
    this.loadbalancerId = $stateParams.loadbalancerId;
    this.validate = $stateParams.validate;

    this.loaders = {
      loadbalancer: true,
      table: {
        server: false,
      },
      form: {
        loadbalancer: false,
      },
    };

    // Data
    this.loadbalancer = {};
    this.table = {
      server: [],
    };

    this.form = {
      openstack: false,
      protocole: 'HTTP',
      servers: {},
    };

    this.toggle = {
      updatedMessage: false,
    };
  }

  $onInit() {
    // Get loadbalancer pending tasks and define poller
    this.tasks = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.IpLoadBalancerTaskService.getTasks(
          this.loadbalancerId,
        ).then((tasks) =>
          filter(tasks, (task) => includes(['todo', 'doing'], task.status)),
        ),
      successHandler: () => this.startTaskPolling(),
    });
    this.tasks.load();

    let validatePromise;
    // Terminate validation if params exists
    if (this.validate) {
      this.loaders.loadbalancer = true;
      validatePromise = this.OvhApiCloudProjectIplb.v6()
        .validate(
          {
            serviceName: this.serviceName,
            id: this.validate,
          },
          {},
        )
        .$promise.then(() => {
          this.$location.search('validate', null);
          this.toggle.updatedMessage = true;
        })
        .catch((err) =>
          this.CucCloudMessage.error(
            [
              this.$translate.instant('cpc_loadbalancer_error'),
              (err.data && err.data.message) || '',
            ].join(' '),
          ),
        )
        .finally(() => {
          this.loaders.loadbalancer = false;
        });
      this.validate = '';
    } else {
      validatePromise = Promise.resolve('');
    }

    validatePromise.then(() => this.getLoadbalancer(true));

    this.$scope.$on('$destroy', () => this.stopTaskPolling());
    this.initGuides();
  }

  back() {
    this.$state.go('iaas.pci-project.compute.loadbalancer');
  }

  initGuides() {
    this.guides = {
      horizon: this.ovhDocUrl.getDocUrl('g1773.creer_un_acces_a_horizon'),
    };
  }

  // Get cloud servers to add in the loadbalancer
  getServerList() {
    if (this.loaders.table.server) {
      return this.$q.reject('servers already loading');
    }
    this.loaders.table.server = true;
    return this.CloudProjectComputeLoadbalancerService.getServerList({
      serviceName: this.serviceName,
      loadbalancer: this.loadbalancer,
    })
      .then(({ servers, attachedServers }) => {
        this.attachedServers = attachedServers;
        this.form.servers = mapValues(this.attachedServers, (e) => !!e);
        this.table.server = servers;
      })
      .catch(() => {
        this.table.server = null;
      })
      .finally(() => {
        this.loaders.table.server = false;
      });
  }

  configureAndDeployLoadbalancer() {
    if (this.loaders.form.loadbalancer) {
      return this.$q.reject('already sending configuration');
    }
    this.loaders.form.loadbalancer = true;
    let configurePromise = this.$q.resolve();

    // Configure the HTTP(80) loadbalancer
    const configLoadBalancer =
      (values(this.form.servers).length &&
        reduce(this.form.servers, (res, value) => res && value, true)) ||
      values(this.attachedServers).length > 0;
    if (
      this.loadbalancer.status !== 'custom' &&
      this.loadbalancer.status !== 'unavailable' &&
      configLoadBalancer
    ) {
      if (this.loadbalancer.status === 'available') {
        // Create farm and front
        configurePromise = configurePromise
          .then(
            () =>
              this.OvhApiIpLoadBalancing.Farm().Http().v6().post(
                {
                  serviceName: this.loadbalancerId,
                },
                {
                  displayName: 'PublicCloud',
                  port: 80,
                  zone: 'all',
                },
              ).$promise,
          )
          .then((farm) => {
            this.loadbalancer.farm = farm;
          })
          .then(
            () =>
              this.OvhApiIpLoadBalancing.Frontend().Http().v6().post(
                {
                  serviceName: this.loadbalancerId,
                },
                {
                  displayName: 'PublicCloud',
                  port: 80,
                  zone: 'all',
                  defaultFarmId: this.loadbalancer.farm.farmId,
                },
              ).$promise,
          )
          .then((frontend) => {
            this.loadbalancer.frontend = frontend;
          });
      }

      // Add or remove servers
      let modified = false;
      forEach(this.form.servers, (enable, ip) => {
        const server = find(this.table.server, { ip });
        const displayName = server ? server.label : null;
        if (enable && !this.attachedServers[ip]) {
          modified = true;
          configurePromise = configurePromise.then(
            () =>
              this.OvhApiIpLoadBalancing.Farm().Http().Server().v6().post(
                {
                  serviceName: this.loadbalancerId,
                  farmId: this.loadbalancer.farm.farmId,
                },
                {
                  displayName,
                  port: 80,
                  address: ip,
                  status: 'active',
                },
              ).$promise,
          );
        }
        if (!enable && this.attachedServers[ip]) {
          modified = true;
          configurePromise = configurePromise.then(
            () =>
              this.OvhApiIpLoadBalancing.Farm().Http().Server().v6().delete({
                serviceName: this.loadbalancerId,
                serverId: this.attachedServers[ip].serverId,
                farmId: this.loadbalancer.farm.farmId,
              }).$promise,
          );
        }
      });

      // Deploy configuration
      if (modified) {
        configurePromise = configurePromise
          .then(
            () =>
              this.OvhApiIpLoadBalancing.v6().refresh(
                {
                  serviceName: this.loadbalancerId,
                },
                {},
              ).$promise,
          )
          .then(() => this.tasks.load())
          .then(() => this.getLoadbalancer(true));
      }
    }
    // Configure the openstack importation
    if (
      this.form.openstack &&
      (!this.loadBalancerImported ||
        this.loadBalancerImported.status !== 'validated')
    ) {
      // Need to remove old import to recreate it
      if (this.loadBalancerImported) {
        configurePromise = configurePromise.then(
          () =>
            this.OvhApiCloudProjectIplb.v6().delete({
              serviceName: this.serviceName,
              id: this.loadBalancerImported.id,
            }).$promise,
        );
      }
      configurePromise = configurePromise.then(() =>
        this.OvhApiCloudProjectIplb.v6()
          .post(
            {
              serviceName: this.serviceName,
            },
            {
              ipLoadbalancingServiceName: this.loadbalancerId,
              redirection: `${this.$location
                .hash('')
                .absUrl()
                .replace(/\?.*$/, '')}?validate=%id`,
            },
          )
          .$promise.then((result) => {
            this.$window.location.href = result.validationUrl;
            this.loaders.form.redirect = true;
          }),
      );
    } else if (!this.form.openstack && this.loadBalancerImported) {
      configurePromise = configurePromise
        .then(
          () =>
            this.OvhApiCloudProjectIplb.v6().delete({
              serviceName: this.serviceName,
              id: this.loadBalancerImported.id,
            }).$promise,
        )
        .then(() => {
          this.loadBalancerImported = null;
          this.form.openstack = false;
        });
    }
    return configurePromise
      .then(() => {
        this.toggle.updatedMessage = true;
      })
      .catch((err) =>
        this.CucCloudMessage.error(
          [
            this.$translate.instant('cpc_loadbalancer_error'),
            (err.data && err.data.message) || '',
          ].join(' '),
        ),
      )
      .finally(() => {
        this.$location.hash('compute-loadbalancer-configure');
        this.$anchorScroll();
        this.loaders.form.loadbalancer = false;
      });
  }

  getLoadbalancer(clearCache) {
    this.loaders.loadbalancer = true;
    if (clearCache) {
      this.OvhApiCloudProjectIplb.v6().resetQueryCache();
      this.OvhApiIpLoadBalancing.v6().resetQueryCache();
    }
    return this.$q
      .all({
        loadbalancer: this.CloudProjectComputeLoadbalancerService.getLoadbalancer(
          this.loadbalancerId,
        ),
        loadbalancersImported: this.CloudProjectComputeLoadbalancerService.getLoadbalancersImported(
          this.serviceName,
        ),
      })
      .then(({ loadbalancer, loadbalancersImported }) => {
        this.loadbalancer = loadbalancer;

        this.loadBalancerImported =
          loadbalancersImported[this.loadbalancer.serviceName];
        if (!this.loadBalancerImported) {
          return;
        }
        if (this.loadBalancerImported.status === 'validated') {
          this.form.openstack = true;
        }
      })
      .then(() => {
        this.loaders.loadbalancer = false;
      })
      .then(() => this.getServerList())
      .catch((err) => {
        this.loadbalancer = null;
        this.CucCloudMessage.error(
          [
            this.$translate.instant('cpc_loadbalancer_error'),
            (err.data && err.data.message) || '',
          ].join(' '),
        );
      });
  }

  startTaskPolling() {
    this.stopTaskPolling();

    this.poller = this.CucCloudPoll.pollArray({
      items: this.tasks.data,
      pollFunction: (task) =>
        this.IpLoadBalancerTaskService.getTask(this.loadbalancerId, task.id),
      stopCondition: (task) => {
        const res = includes(['done', 'error'], task.status);
        // Remove terminated tasks
        if (res) {
          this.tasks.data = filter(this.tasks.data, (t) => t.id !== task.id);
        }
        return res;
      },
    });
  }

  stopTaskPolling() {
    if (this.poller) {
      this.poller.kill();
    }
  }
}
angular
  .module('managerApp')
  .controller(
    'CloudProjectComputeLoadbalancerConfigureCtrl',
    CloudProjectComputeLoadbalancerConfigureCtrl,
  );
