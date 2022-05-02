import find from 'lodash/find';
import filter from 'lodash/filter';
import get from 'lodash/get';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import animateScrollTo from 'animated-scroll-to';
import { API_GUIDES } from '../../../project.constants';

import { ENGINES_STATUS } from '../../../../../components/project/storages/databases/engines.constants';
import { ENGINE_LOGOS } from '../databases.constants';
import { ORDER_KEYS } from './add.constants';

export default class {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    DatabaseService,
    ovhManagerRegionService,
    $scope,
    $timeout,
  ) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.DatabaseService = DatabaseService;
    this.ENGINE_LOGOS = ENGINE_LOGOS;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.orderKeys = ORDER_KEYS;
    this.$timeout = $timeout;
  }

  $onInit() {
    this.labAccepted = this.lab.isActivated();
    this.messageContainer = 'pci.projects.project.storages.databases.add';
    this.loadMessages();
    this.model = {
      engine: find(this.engines, 'isDefault') || this.engines[0],
      plan: null,
      region: null,
      flavor: null,
      name: '',
      privateNetwork: null,
      subnet: null,
      usePrivateNetwork: false,
    };
    this.defaultPrivateNetwork = {
      id: '',
      name: this.$translate.instant('pci_database_common_none'),
    };
    this.defaultSubnet = {
      id: '',
      name: this.$translate.instant('pci_database_common_none'),
    };
    this.apiGuideUrl =
      API_GUIDES[this.user.ovhSubsidiary] || API_GUIDES.DEFAULT;
    this.trackDatabases('configuration', 'page');

    this.onEngineChanged(this.model.engine);

    this.scrollToOptions = {
      element: document.getElementsByClassName('pci-project-content')[0],
      offset: 0,
      horizontal: false,
    };
  }

  scrollTo(id) {
    animateScrollTo(document.getElementById(id), this.scrollToOptions);
  }

  acceptLab(accepted) {
    this.labAccepted = accepted;
  }

  clickOnContract() {
    this.trackDatabases('config_create_database::ga_contracts');
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

  onPrivateNetworkChange(privateNetwork) {
    this.loadingSubnets = true;
    this.model.subnet = this.defaultSubnet;
    this.DatabaseService.getSubnets(this.projectId, privateNetwork.id)
      .then((subnets) => {
        this.availableSubnets = [
          this.defaultSubnet,
          ...map(
            filter(subnets, (subnet) =>
              find(subnet.ipPools, (ipPool) =>
                ipPool.region.startsWith(this.model.region.name),
              ),
            ),
            (subnet) => ({
              ...subnet,
              name: `${subnet.ipPools[0].network} - ${subnet.ipPools[0].region}`,
            }),
          ),
        ];
      })
      .catch(() => {
        this.availableSubnets = [];
      })
      .finally(() => {
        this.loadingSubnets = false;
      });
    this.getOrderData();
  }

  isNetworkSelected() {
    return this.model.usePrivateNetwork
      ? this.model.privateNetwork.id && this.model.subnet?.id
      : true;
  }

  onNetworkTypeChange(usePrivateNetwork) {
    if (!usePrivateNetwork) this.model.subnet = null;
    this.getOrderData();
  }

  // bug in oui-numeric: on-change event is fired before model is updated
  onNodeNumberChange() {
    this.$timeout(() => this.getOrderData());
  }

  getNodesSpecTranslation() {
    const prefix = 'pci_database_add_spec_nodes';
    const range =
      this.model.plan.nodesCount === this.model.plan.maxNodes ? '' : '_range';
    const single = this.model.plan.nodesCount === 1 ? '_single' : '';
    const translateKey = `${prefix}${range}${single}`;
    return this.$translate.instant(translateKey, {
      min: this.model.plan.nodesCount,
      max: this.model.plan.maxNodes,
    });
  }

  getOrderData() {
    this.orderAPIUrl = `POST /cloud/project/${this.projectId}/database/${this.model.engine.name}`;
    this.orderData = {
      description: this.model.name,
      nodesPattern: {
        flavor: this.model.flavor.name,
        number: this.model.plan.nodesCount,
        region: this.model.region.name,
      },
      plan: this.model.plan.name,
      version: this.model.engine.selectedVersion.version,
    };
    if (this.model.usePrivateNetwork && this.model.subnet?.id?.length > 0) {
      this.orderData.networkId = this.model.privateNetwork.regions?.find(
        (region) => region.region === this.model.subnet?.ipPools[0].region,
      )?.openstackId;
      this.orderData.subnetId = this.model.subnet?.id;
    }

    this.commandData = {
      orderAPIUrl: this.orderAPIUrl,
      orderData: this.orderData,
      orderKeys: this.orderKeys,
      apiGuideUrl: this.apiGuideUrl,
    };
  }

  onEngineChanged(engine) {
    this.model.engine = engine;
    this.model.plan = this.getSyncPlan(engine);
    this.onPlanChanged(this.model.plan);
  }

  onPlanChanged(plan) {
    this.model.plan = plan;
    this.model.region = this.getSyncRegion(plan);
    this.onRegionChanged(this.model.region);
  }

  onRegionChanged(region) {
    this.model.region = region;
    this.model.flavor = this.getSyncFlavor(region);
    this.onFlavorChanged(this.model.flavor);
  }

  onFlavorChanged(flavor) {
    this.model.flavor = flavor;
    this.model.name = `${this.model.engine.name}-${flavor.name}-${this.model.plan.name}`;

    if (!flavor.supportsPrivateNetwork) {
      this.model.usePrivateNetwork = false;
      this.model.subnet = null;
      this.model.privateNetwork = null;
    } else if (!this.model.usePrivateNetwork) {
      this.model.privateNetwork = this.defaultPrivateNetwork;
      this.model.subnet = null;

      this.availablePrivateNetworks = [
        this.defaultPrivateNetwork,
        ...sortBy(
          map(
            filter(this.privateNetworks, (network) =>
              find(
                network.regions,
                (region) =>
                  region.region.startsWith(this.model.region.name) &&
                  region.status === 'ACTIVE',
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
    this.getOrderData();
  }

  getSyncPlan(engine) {
    const { plans } = engine.selectedVersion;
    let plan = engine.getDefaultPlan();
    if (this.model.plan) {
      const equivalentPlan = plans.find((p) => p.name === this.model.plan.name);
      if (equivalentPlan) {
        plan = equivalentPlan;
      }
    }
    return plan;
  }

  getSyncRegion(plan) {
    const { regions } = plan;
    let region = plan.getDefaultRegion();
    if (this.model.region) {
      const equivalentRegion = regions.find(
        (r) => r.name === this.model.region.name,
      );
      if (equivalentRegion) {
        region = equivalentRegion;
      }
    }
    return region;
  }

  getSyncFlavor(region) {
    const { flavors } = region;
    let flavor = region.getDefaultFlavor();
    if (this.model.flavor) {
      const equivalentFlavor = flavors.find(
        (f) => f.name === this.model.flavor.name,
      );
      if (equivalentFlavor) {
        flavor = equivalentFlavor;
      }
    }
    return flavor;
  }

  createDatabase() {
    this.processingOrder = true;
    this.CucCloudMessage.flushMessages(this.messageContainer);
    this.trackDatabases(`config_create_database::${this.model.engine.name}`);
    this.trackDatabases(
      `PublicCloud_create_new_database::${this.model.engine.name}::${this.orderData.plan}::${this.orderData.nodesPattern.flavor}`,
      'action',
      false,
    );
    // We only need to check the lab for BETA status
    const createDatabasePromise =
      this.model.engine.selectedVersion.status === ENGINES_STATUS.BETA
        ? this.DatabaseService.activateLab(this.projectId, this.lab).then(() =>
            this.DatabaseService.createDatabase(
              this.projectId,
              this.model.engine.name,
              this.orderData,
            ),
          )
        : this.DatabaseService.createDatabase(
            this.projectId,
            this.model.engine.name,
            this.orderData,
          );

    return createDatabasePromise
      .then((databaseInfo) => {
        this.trackDatabases(
          `config_create_database_validated::${this.model.engine.name}`,
        );
        return this.onDatabaseAdd(
          {
            ...databaseInfo,
            engine: this.model.engine.name,
          },
          this.$translate.instant('pci_database_add_create_database_success'),
          'info',
        );
      })
      .catch((error) => {
        this.trackDatabases(
          `config_create_database_error::${this.model.engine.name}`,
        );
        this.CucCloudMessage.error(
          this.$translate.instant('pci_database_add_create_database_error', {
            message: get(error, 'data.message'),
          }),
          this.messageContainer,
        );
        this.currentStep = 0;
        this.$anchorScroll('addMessages');
        this.processingOrder = false;
      });
  }

  $onDestroy() {
    this.DatabaseService.stopPollingLabActivationStatus(this.lab.id);
  }
}
