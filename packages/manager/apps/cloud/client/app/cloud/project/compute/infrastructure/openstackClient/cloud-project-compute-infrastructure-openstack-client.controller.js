import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';

class CloudProjectComputeInfrastructureOpenstackClientCtrl {
  constructor(
    $interval,
    $q,
    $stateParams,
    $translate,
    CucCloudMessage,
    CloudProjectComputeInfrastructureOpenstackClientService,
    CucControllerHelper,
    OvhApiCloudProjectOpenstackClient,
    OvhApiCloudProjectRegion,
  ) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.Service = CloudProjectComputeInfrastructureOpenstackClientService;
    this.CucControllerHelper = CucControllerHelper;
    this.OvhApiCloudProjectOpenstackClient = OvhApiCloudProjectOpenstackClient;
    this.OvhApiCloudProjectRegion = OvhApiCloudProjectRegion;

    this.serviceName = this.$stateParams.projectId;
    this.term = new Terminal();
    this.messages = [];
    this.emptyOption = 'emptyOption';
    this.region = this.emptyOption;
    this.minimized =
      sessionStorage.getItem(
        'CloudProjectComputeInfrastructureOpenstackClientCtrl.minimized',
      ) !== 'false';
    this.maximized =
      sessionStorage.getItem(
        'CloudProjectComputeInfrastructureOpenstackClientCtrl.maximized',
      ) === 'true';
    this.actions = {
      help: 'openstack help | less',
      catalog: 'openstack catalog list',
      server: 'openstack server list',
      image: 'openstack image list',
      flavor: 'openstack flavor list',
      volume: 'openstack volume list',
      network: 'openstack network list',
      subnet: 'openstack subnet list',
      'create server': 'create-server.sh',
      'bigdata platform': 'bigdata-platform-cli',
    };

    this.initLoaders();
  }

  initWithConfig(config) {
    this.actions = get(config, 'actions', this.actions);
    this.region = get(config, 'region', this.region);
    const session = get(config, 'session');

    if (session) {
      this.minimized = false;
      this.maximized = false;
      set(this.session, 'data', this.Service.setSession(session, this.term));
    }

    this.load();
  }

  initAndMaximizeWithConfig(config) {
    this.OvhApiCloudProjectOpenstackClient.initWithConfig(config);
    this.OvhApiCloudProjectOpenstackClient.maximize();
  }

  initLoaders() {
    this.session = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.Service.getSession({
          serviceName: this.serviceName,
          term: this.term,
        }),
    });
    this.regions = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.Service.getRegions(this.serviceName),
    });
  }

  $onInit() {
    this.initWithConfig(this.$stateParams.hTerm);
    this.CucCloudMessage.unSubscribe(
      'iaas.pci-project.compute.openstack-console',
    );
    this.messageHandler = this.CucCloudMessage.subscribe(
      'iaas.pci-project.compute.openstack-console',
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  clickBar() {
    if (this.minimized) {
      this.minimized = false;
      this.load();
      this.savePrefs();
    }
  }

  minimize($event) {
    this.minimized = !this.minimized;
    this.maximized = false;
    this.savePrefs();
    $event.stopPropagation();
  }

  maximize($event) {
    this.maximized = !this.maximized;
    this.minimized = false;
    this.load();
    this.savePrefs();
    $event.stopPropagation();
  }

  $onDestroy() {
    this.Service.close();
  }

  load() {
    if (this.minimized) {
      return;
    }

    // No cache as it's POST
    if (
      !this.session.loading &&
      (this.session.hasErrors || isEmpty(this.session.data))
    ) {
      this.session.load();
    }
    this.regions.load();
  }

  savePrefs() {
    sessionStorage.setItem(
      'CloudProjectComputeInfrastructureOpenstackClientCtrl.minimized',
      this.minimized,
    );
    sessionStorage.setItem(
      'CloudProjectComputeInfrastructureOpenstackClientCtrl.maximized',
      this.maximized,
    );
  }
}

angular
  .module('managerApp')
  .controller(
    'CloudProjectComputeInfrastructureOpenstackClientCtrl',
    CloudProjectComputeInfrastructureOpenstackClientCtrl,
  );
