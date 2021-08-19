import find from 'lodash/find';
import filter from 'lodash/filter';
import get from 'lodash/get';
import map from 'lodash/map';
import clone from 'lodash/clone';
import sortBy from 'lodash/sortBy';

import { NAME_PATTERN } from './fork.constants';

export default class {
  /* @ngInject */
  constructor(
    $anchorScroll,
    $translate,
    $q,
    $scope,
    CucCloudMessage,
    DatabaseService,
    Poller,
  ) {
    this.$anchorScroll = $anchorScroll;
    this.$translate = $translate;
    this.$q = $q;
    this.$scope = $scope;
    this.CucCloudMessage = CucCloudMessage;
    this.DatabaseService = DatabaseService;
    this.Poller = Poller;
    this.NAME_PATTERN = NAME_PATTERN;
  }

  $onInit() {
    this.labAccepted = this.lab.isActivated();
    this.messageContainer = 'pci.projects.project.storages.databases.fork';
    this.loadMessages();

    // Retrieve data from db object
    const engine = find(this.engines, (e) => e.name === this.database.engine);
    engine.selectedVersion = find(
      engine.versions,
      (v) => v.version === this.database.version,
    );
    const plan = find(
      engine.selectedVersion.plans,
      (p) => p.name === this.database.plan,
    );
    const region = find(
      plan.regions,
      (r) => r.name === this.database.nodes[0].region,
    );
    const flavor = find(
      region.flavors,
      (f) => f.name === this.database.nodes[0].flavor,
    );

    // Get network
    this.availablePrivateNetworks = this.getAvailableNetworks(region);
    // Get subnet
    if (this.database.networkType === 'private') {
      this.getSubnets(region);
    }

    // Save current db state
    this.current = {
      engine: clone(engine),
      plan: clone(plan),
      flavor: clone(flavor),
    };

    // Initialize model object with db data
    this.model = {
      engine,
      plan,
      region,
      flavor,
      name: `${engine.name}-${flavor.name}-${plan.name}-`,
      privateNetwork: this.availablePrivateNetworks[0],
      subnet: null,
      usePrivateNetwork: this.database.networkType === 'private',
    };

    this.orderData = null;
    this.prepareOrderData();
    this.trackDatabases('configuration_fork', 'page');
  }

  getAvailableNetworks(region) {
    return [
      ...sortBy(
        map(
          filter(this.privateNetworks, (network) =>
            find(
              network.regions,
              (r) =>
                r.region.startsWith(region.name) &&
                r.status === 'ACTIVE' &&
                r.openstackId === this.database.networkId,
            ),
          ),
          (privateNetwork) => ({
            ...privateNetwork,
            name: `${privateNetwork.vlanId.toString().padStart(4, '0')} - ${
              privateNetwork.name
            }`,
          }),
        ),
        ['name'],
      ),
    ];
  }

  getSubnets(region) {
    this.loadingSubnets = true;
    this.DatabaseService.getSubnets(
      this.projectId,
      this.availablePrivateNetworks[0].id,
    )
      .then((subnets) => {
        this.availableSubnets = [
          ...map(
            filter(subnets, (subnet) =>
              find(subnet.ipPools, (ipPool) =>
                ipPool.region.startsWith(region.name),
              ),
            ),
            (subnet) => ({
              ...subnet,
              name: `${subnet.ipPools[0].network} - ${subnet.ipPools[0].region}`,
            }),
          ),
        ];
        this.model.subnet = find(
          this.availableSubnets,
          (subnet) => subnet.id === this.database.subnetId,
        );
      })
      .catch(() => {
        this.availableSubnets = [];
      })
      .finally(() => {
        this.loadingSubnets = false;
      });
  }

  acceptLab(accepted) {
    this.labAccepted = accepted;
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(this.messageContainer);
    this.messageHandler = this.CucCloudMessage.subscribe(
      this.messageContainer,
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  onEngineSelect() {
    this.model.plan = find(
      this.model.engine.selectedVersion.plans,
      (plan) => plan.name === this.model.plan.name,
    );
    this.onPlanSelect();
  }

  onPlanSelect() {
    this.model.region = find(
      this.model.plan.regions,
      (region) => region.name === this.model.region.name,
    );
    this.onRegionSelect();
  }

  onRegionSelect() {
    this.model.flavor = find(
      this.model.region.flavors,
      (flavor) => flavor.name === this.model.flavor.name,
    );
    this.onFlavorSelect();
  }

  onFlavorSelect() {
    this.model.usePrivateNetwork = !this.model.flavor.supportsPublicNetwork;
    this.model.privateNetwork = this.defaultPrivateNetwork;
    this.model.subnet = null;
    this.model.name = `${this.model.engine.name}-${this.model.flavor.name}-${this.model.plan.name}-`;
    this.prepareOrderData();
  }

  prepareOrderData() {
    this.orderData = {
      backup: {
        id: this.backupInstance.id,
        service: this.database.id,
      },
      description: this.model.name,
      networkId: this.database?.networkId,
      subnetId: this.database?.subnetId,
      nodesList: null,
      nodesPattern: {
        flavor: this.model.flavor.name,
        number: this.model.plan.nodesCount,
        region: this.model.region.name,
      },
      plan: this.model.plan.name,
      version: this.model.engine.selectedVersion.version,
    };
  }

  createDatabase() {
    this.processingOrder = true;
    this.CucCloudMessage.flushMessages(this.messageContainer);
    this.trackDatabases(`config_fork_database::${this.model.engine.name}`);
    this.trackDatabases(
      `PublicCloud_fork_new_database::${this.model.engine.name}::${this.orderData.plan}::${this.orderData.nodesPattern.flavor}`,
      'action',
      false,
    );
    return this.DatabaseService.activateLab(this.projectId, this.lab)
      .then(() =>
        this.DatabaseService.createDatabase(
          this.projectId,
          this.model.engine.name,
          this.orderData,
        ),
      )
      .then((databaseInfo) => {
        this.trackDatabases(
          `config_fork_database_validated::${this.model.engine.name}`,
        );
        return this.onDatabaseFork(
          {
            ...databaseInfo,
            engine: this.model.engine.name,
          },
          this.$translate.instant('pci_database_fork_create_database_success'),
          'info',
        );
      })
      .catch((error) => {
        this.trackDatabases(
          `config_fork_database_error::${this.model.engine.name}`,
        );
        this.CucCloudMessage.error(
          this.$translate.instant('pci_database_fork_create_database_error', {
            message: get(error, 'data.message'),
          }),
          this.messageContainer,
        );
        this.$anchorScroll('forkMessages');
        this.processingOrder = false;
      });
  }

  $onDestroy() {
    this.DatabaseService.stopPollingLabActivationStatus(this.lab.id);
  }
}
