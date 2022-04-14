import find from 'lodash/find';
import filter from 'lodash/filter';
import get from 'lodash/get';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import capitalize from 'lodash/capitalize';
import { API_GUIDES } from '../../../project.constants';

import {
  NAME_PATTERN,
  MAX_NAME_LENGTH,
  MIN_NAME_LENGTH,
} from './add.constants';
import { ENGINES_STATUS } from '../../../../../components/project/storages/databases/engines.constants';
import { ENGINE_LOGOS } from '../databases.constants';

export default class {
  /* @ngInject */
  constructor(
    $anchorScroll,
    $translate,
    $q,
    CucCloudMessage,
    DatabaseService,
    Poller,
    ovhManagerRegionService,
  ) {
    this.$anchorScroll = $anchorScroll;
    this.$translate = $translate;
    this.$q = $q;
    this.CucCloudMessage = CucCloudMessage;
    this.DatabaseService = DatabaseService;
    this.Poller = Poller;
    this.NAME_PATTERN = NAME_PATTERN;
    this.MIN_NAME_LENGTH = MIN_NAME_LENGTH;
    this.MAX_NAME_LENGTH = MAX_NAME_LENGTH;
    this.ENGINE_LOGOS = ENGINE_LOGOS;
    this.capitalize = capitalize;
    this.ovhManagerRegionService = ovhManagerRegionService;
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
    this.orderData = null;
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
  }

  checkPattern(value) {
    return this.NAME_PATTERN.test(value);
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

  // setDefaultPlan() {
  //   this.model.plan = this.model.engine.selectedVersion.getDefaultPlan(
  //     this.model.plan,
  //   );
  // }

  // setDefaultRegion() {
  //   this.model.region = this.model.plan.getDefaultRegion(this.model.region);
  // }

  // setDefaultFlavor() {
  //   this.model.flavor = this.model.region.getDefaultFlavor(this.model.flavor);
  // }

  // onFlavorSelect() {
  //   this.model.usePrivateNetwork = !this.model.flavor.supportsPublicNetwork;
  //   this.model.privateNetwork = this.defaultPrivateNetwork;
  //   this.model.subnet = null;
  //   this.model.name = `${this.model.engine.name}-${this.model.flavor.name}-${this.model.plan.name}-`;
  //   this.availablePrivateNetworks = [
  //     this.defaultPrivateNetwork,
  //     ...sortBy(
  //       map(
  //         filter(this.privateNetworks, (network) =>
  //           find(
  //             network.regions,
  //             (region) =>
  //               region.region.startsWith(this.model.region.name) &&
  //               region.status === 'ACTIVE',
  //           ),
  //         ),
  //         (privateNetwork) => ({
  //           ...privateNetwork,
  //           name: `${privateNetwork.vlanId.toString().padStart(4, '0')} - ${
  //             privateNetwork.name
  //           }`,
  //         }),
  //       ),
  //       ['name'],
  //     ),
  //   ];
  // }

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
  }

  isNetworkSelected() {
    return this.model.usePrivateNetwork
      ? this.model.privateNetwork.id && this.model.subnet?.id
      : true;
  }

  onNetworkTypeChange(usePrivateNetwork) {
    if (!usePrivateNetwork) this.model.subnet = null;
  }

  getNodesSpecTranslation() {
    return this.$translate.instant(
      this.model.plan.minNodes === this.model.plan.maxNodes
        ? `pci_database_plans_list_spec_nodes${
            this.model.plan.minNodes === 1 ? '_single' : ''
          }`
        : `pci_database_plans_list_spec_nodes_range${
            this.model.plan.minNodes === 1 ? '_single_min' : ''
          }`,
      {
        min: this.model.plan.minNodes,
        max: this.model.plan.maxNodes,
      },
    );
  }

  prepareOrderData() {
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

    this.orderAPIUrl = `POST /cloud/project/${this.projectId}/database/${this.model.engine.name}`;
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
    this.prepareOrderData();
  }

  getSyncPlan(engine) {
    const { plans } = engine.selectedVersion;
    let plan = plans[0];
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
    let region = regions[0];
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
    let flavor = flavors[0];
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
