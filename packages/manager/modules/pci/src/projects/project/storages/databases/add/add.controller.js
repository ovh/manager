import find from 'lodash/find';
import filter from 'lodash/filter';
import get from 'lodash/get';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import capitalize from 'lodash/capitalize';
import omit from 'lodash/omit';
import animateScrollTo from 'animated-scroll-to';
import { ENGINE_LOGOS } from '../databases.constants';
import { PRIVATE_NETWORK_GUIDE, URL_MODEL } from './add.constants';
import { getOrderDataFromModel } from './add.utils';
import { nameGenerator } from '../../../../../name-generator.constant';
import { useURLModel } from '../../../project.utils';

export default class {
  /* @ngInject */
  constructor(
    $translate,
    $timeout,
    $document,
    $anchorScroll,
    coreConfig,
    CucCloudMessage,
    DatabaseService,
    ovhManagerRegionService,
  ) {
    this.$translate = $translate;
    this.$timeout = $timeout;
    this.$document = $document;
    this.$anchorScroll = $anchorScroll;
    this.CucCloudMessage = CucCloudMessage;
    this.DatabaseService = DatabaseService;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.ENGINE_LOGOS = ENGINE_LOGOS;
    this.nameGenerator = nameGenerator;
    this.capitalize = capitalize;
    this.user = coreConfig.getUser();
  }

  $onInit() {
    const {
      model: { engineName },
    } = useURLModel(URL_MODEL);

    this.showMonthlyPrices = false;
    this.messageContainer = 'pci.projects.project.storages.databases.add';
    this.loadMessages();
    this.model = {
      engine:
        find(this.availableEngines, { name: engineName }) ||
        find(this.availableEngines, 'isDefault') ||
        this.availableEngines[0],
      plan: {
        name: null,
      },
      region: {
        name: null,
      },
      flavor: {
        name: null,
      },
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
    this.privateNetworkGuideUrl =
      PRIVATE_NETWORK_GUIDE[this.user.ovhSubsidiary] ||
      PRIVATE_NETWORK_GUIDE.DEFAULT;
    this.trackDatabases('configuration', 'page');

    this.preselectStepItem();
    this.updateEngine(this.model.engine);

    // If we find the parentElement, we can enable smooth scrolling. Otherwise, fallback to $anchor
    const scrollParentElement = this.$document[0].getElementsByClassName(
      'pci-project-content',
    )[0];
    this.scrollToOptions = scrollParentElement
      ? {
          element: scrollParentElement,
          offset: 0,
          horizontal: false,
        }
      : null;

    // For US only, remove Mongo from guides
    this.filteredGuides =
      this.user.ovhSubsidiary === 'US'
        ? omit(this.guideUrl.databases, 'mongo_db_capabilities_and_limitations')
        : this.guideUrl.databases;
  }

  /**
   * Use this to preselect an item regarding current step
   */
  preselectStepItem() {
    const { steps } = this.redirectTarget;
    if (steps) {
      this.model.engine =
        this.availableEngines.find(({ name }) => name === steps.STEP_1) ||
        this.model.engine;

      this.model.plan.name = steps.STEP_2;
      this.model.region.name = steps.STEP_3;
      this.model.flavor.name = steps.STEP_4;
    }
  }

  scrollTo(id) {
    this.trackDatabases(`databases_config_page::basket::anchors::${id}`);
    // If we have the scrollToOptions, we can use the smooth scrolling, otherwise we use $anchor
    if (this.scrollToOptions) {
      animateScrollTo(document.getElementById(id), this.scrollToOptions);
    } else {
      this.$anchorScroll(id);
    }
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
  }

  isNetworkSelected() {
    return this.model.usePrivateNetwork
      ? this.model.privateNetwork.id && this.model.subnet?.id
      : true;
  }

  onNetworkTypeChange(usePrivateNetwork) {
    if (!usePrivateNetwork) this.model.subnet = null;
  }

  onEngineChanged(engine) {
    this.updateEngine(engine);
  }

  onPlanChanged(plan) {
    this.updatePlan(plan);
  }

  onRegionChanged(region) {
    this.updateRegion(region);
  }

  onFlavorChanged(flavor) {
    this.updateFlavor(flavor);
  }

  updateEngine(engine) {
    this.model.engine = engine;
    this.model.plan = this.getSyncPlan(engine);
    this.model.name = this.nameGenerator();
    this.updatePlan(this.model.plan);
  }

  updatePlan(plan) {
    this.model.plan = plan;
    this.model.region = this.getSyncRegion(plan);
    this.updateRegion(this.model.region);
  }

  updateRegion(region) {
    if (this.model.region.name !== region.name) {
      this.model.region = region;
      this.model.privateNetwork = null;
    }
    this.model.flavor = this.getSyncFlavor(region);
    this.updateFlavor(this.model.flavor);
  }

  updateFlavor(flavor) {
    this.model.flavor = flavor;
    this.model.disk = {
      initialSize: flavor.minDiskSize,
      additionalDiskSize: 0,
      step: flavor.stepDiskSize,
    };
    if (!flavor.supportsPrivateNetwork) {
      this.model.usePrivateNetwork = false;
      this.model.subnet = null;
      this.model.privateNetwork = null;
    } else if (
      !this.model.usePrivateNetwork ||
      this.model.privateNetwork === null
    ) {
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

  trackAndGoToCommand() {
    this.trackDatabases(`databases_config_page::basket::goto_api_equivalent`);
    this.goToCommand(this.model);
  }

  trackNamePopover() {
    this.trackDatabases(`databases_config_page::basket::info_popin::name`);
  }

  get storageNodeFactor() {
    return this.model.engine.isDistributedStorage
      ? 1
      : this.model.plan.nodesCount;
  }

  get price() {
    const flavorPrice = this.showMonthlyPrices
      ? this.model.flavor.monthlyPrice
      : this.model.flavor.hourlyPrice;
    const additionalDiskPrice =
      (this.showMonthlyPrices
        ? this.model.flavor.monthlyPricePerGB
        : this.model.flavor.hourlyPricePerGB
      ).priceInUcents || 0;
    return (
      this.model.plan.nodesCount * flavorPrice.priceInUcents +
      additionalDiskPrice *
        this.model.disk.additionalDiskSize *
        this.storageNodeFactor
    );
  }

  get tax() {
    const flavorPrice = this.showMonthlyPrices
      ? this.model.flavor.monthlyPrice
      : this.model.flavor.hourlyPrice;
    const additionalDiskPrice =
      (this.showMonthlyPrices
        ? this.model.flavor.monthlyPricePerGB
        : this.model.flavor.hourlyPricePerGB
      ).tax || 0;
    return (
      this.model.plan.nodesCount * flavorPrice.tax +
      this.model.disk.additionalDiskSize *
        additionalDiskPrice *
        this.storageNodeFactor
    );
  }

  createDatabase() {
    this.processingOrder = true;
    this.CucCloudMessage.flushMessages(this.messageContainer);
    this.trackDatabases(`config_create_database::${this.model.engine.name}`);
    this.trackDatabases(
      `PublicCloud_create_new_database::${this.model.engine.name}::${this.model.plan.name}::${this.model.flavor.name}`,
      'action',
      false,
    );
    const orderData = getOrderDataFromModel(this.model);
    return this.DatabaseService.createDatabase(
      this.projectId,
      this.model.engine.name,
      orderData,
    )
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
}
