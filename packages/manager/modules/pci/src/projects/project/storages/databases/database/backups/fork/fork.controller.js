import animateScrollTo from 'animated-scroll-to';
import moment from 'moment';
import { nameGenerator } from '../../../../../../../name-generator.constant';
import { PRIVATE_NETWORK_GUIDE } from '../../../add/add.constants';
import { DATABASE_TYPES, ENGINE_LOGOS } from '../../../databases.constants';
import isFeatureActivated from '../../../features.constants';
import { RESTORE_MODES } from './fork.constants';

export default class {
  /* @ngInject */
  constructor(
    $translate,
    $document,
    $anchorScroll,
    $timeout,
    CucCloudMessage,
    DatabaseService,
    ovhManagerRegionService,
  ) {
    this.$translate = $translate;
    this.$document = $document;
    this.$anchorScroll = $anchorScroll;
    this.$timeout = $timeout;
    this.CucCloudMessage = CucCloudMessage;
    this.DatabaseService = DatabaseService;
    this.ovhManagerRegionService = ovhManagerRegionService;
  }

  $onInit() {
    this.messageContainer =
      'pci.projects.project.storages.databases.dashboard.backups.fork';
    this.loadMessages();

    this.ENGINE_LOGOS = ENGINE_LOGOS;
    this.RESTORE_MODES = RESTORE_MODES;
    this.trackDashboard('backups::options_menu::fork', 'page');

    this.privateNetworkGuideUrl =
      PRIVATE_NETWORK_GUIDE[this.user.ovhSubsidiary] ||
      PRIVATE_NETWORK_GUIDE.DEFAULT;

    const availablePlans = [
      ...this.availableEngines
        .find((e) => e.name === this.database.engine)
        .versions.find((v) => v.version === this.database.version).plans,
    ];
    if (!availablePlans.find((p) => p.name === this.database.plan)) {
      const allPlans = this.engine.getAvailablePlans(
        this.database.version,
        this.database.region,
      );
      const currPlan = allPlans.find((p) => p.name === this.database.plan);
      availablePlans.push(currPlan);
    }

    // Retrieve data from db object
    const engine = this.database.getEngineFromList(this.availableEngines);
    const version = engine.getVersion(this.database.version);
    engine.selectedVersion = version;
    this.originalPlan = availablePlans.find(
      (p) => p.name === this.database.plan,
    );
    this.originalRegion = this.originalPlan.getRegion(
      this.database.nodes[0].region,
    );
    this.originalFlavor = this.originalRegion.getFlavor(
      this.database.nodes[0].flavor,
    );

    this.plans = availablePlans;

    this.model = {
      engine,
      plan: this.originalPlan,
      region: this.originalRegion,
      flavor: this.originalFlavor,
      name: nameGenerator(`${engine.name}-`),
      privateNetwork: null,
      subnet: null,
      usePrivateNetwork: false,
      restoreMode: this.restoreMode || RESTORE_MODES.SOONEST,
      backupId: this.backupId || this.backupList[0]?.id,
      timestamp: moment().toISOString(),
      additionalDiskSize: 0,
    };

    // handle network initialisation

    // Default network values for input fields
    this.defaultPrivateNetwork = {
      id: '',
      name: this.$translate.instant('pci_database_common_none'),
    };
    this.defaultSubnet = {
      id: '',
      name: this.$translate.instant('pci_database_common_none'),
    };

    // load and map networks
    this.loadAvailableNetworks();

    // init model with database network values
    if (this.database.networkType === 'private') {
      this.model.usePrivateNetwork = true;
      this.model.privateNetwork = this.availablePrivateNetworks.find(
        (network) =>
          network.regions?.find(
            (networkRegion) =>
              networkRegion.openstackId === this.database.networkId,
          ),
      );
      if (this.model.privateNetwork) {
        this.initialLoadSubnet = true;
        this.DatabaseService.getSubnets(
          this.projectId,
          this.model.privateNetwork.id,
        )
          .then((subnets) => {
            this.availableSubnets = this.handleSubnetResponse(subnets);
            this.model.subnet = this.availableSubnets.find(
              (subnet) => subnet.id === this.database.subnetId,
            );
          })
          .finally(() => {
            this.initialLoadSubnet = false;
          });
      }
    }

    // handle query params
    if (!this.isPITRActivated || this.backupId) {
      this.model.restoreMode = RESTORE_MODES.BACKUP;
    }

    this.updateFlavor(this.originalFlavor);

    const minDateRetentionDays = moment().subtract(
      this.originalFlavor.availabilities[0].backups.retentionDays,
      'days',
    );
    const clusterCreationDate = moment(this.database.createdAt);
    const minCalendarOptionDate =
      minDateRetentionDays > clusterCreationDate
        ? minDateRetentionDays
        : clusterCreationDate;

    this.calendarOptions = {
      enableSeconds: true,
      minuteIncrement: 1,
      maxDate: moment().toISOString(),
      minDate: minCalendarOptionDate.toISOString(),
    };

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

  get isPITRActivated() {
    return (
      isFeatureActivated('forkPIT', this.database.engine) ||
      (this.database.engine === DATABASE_TYPES.MONGO_DB &&
        this.model.plan.name === 'enterprise')
    );
  }

  scrollTo(id) {
    // If we have the scrollToOptions, we can use the smooth scrolling, otherwise we use $anchor
    if (this.scrollToOptions) {
      animateScrollTo(document.getElementById(id), this.scrollToOptions);
    } else {
      this.$anchorScroll(id);
    }
  }

  onPlanChanged(plan) {
    this.trackDashboard(`backups::options_menu::fork::plan::${plan.name}`);
    this.updatePlan(plan);
  }

  onRegionChanged(region) {
    this.trackDashboard(`backups::options_menu::fork::region::${region.name}`);
    this.updateRegion(region);
  }

  onFlavorChanged(flavor) {
    this.trackDashboard(`backups::options_menu::fork::flavor::${flavor.name}`);
    this.updateFlavor(flavor);
  }

  updatePlan(plan) {
    // assign value to model
    this.model.plan = plan;
    // get equivalent or default values for other inputs
    const equivalentRegion =
      plan.regions.find((region) => region.name === this.model.region.name) ||
      plan.getDefaultRegion();
    this.updateRegion(equivalentRegion);
  }

  updateRegion(region) {
    if (this.model.region.name !== region.name) {
      this.model.region = region;
      this.model.privateNetwork = null;
      this.loadAvailableNetworks();
    }
    // trigger flavors controls and assign to model
    const equivalentFlavor =
      region.flavors.find((flavor) => flavor.name === this.model.flavor.name) ||
      region.getDefaultFlavor();
    this.updateFlavor(equivalentFlavor);
  }

  updateFlavor(flavor) {
    this.model.flavor = flavor;
    // delay the update to avoid value being overrided by component range check
    this.$timeout(() => {
      this.model.additionalDiskSize = this.clusterDiskMinAdditionalStorage;
    });

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
    }
  }

  get isNetworkSelected() {
    return this.model.usePrivateNetwork
      ? this.model.privateNetwork.id && this.model.subnet?.id
      : true;
  }

  onPrivateNetworkChange(privateNetwork) {
    this.model.subnet = this.defaultSubnet;
    this.loadSubnets(privateNetwork);
  }

  handleSubnetResponse(subnets) {
    return [
      this.defaultSubnet,
      ...subnets
        // filter subnet with ipPools in region
        .filter(
          (subnet) =>
            subnet.ipPools.filter((ipPool) =>
              ipPool.region.startsWith(this.model.region.name),
            ).length > 0,
        )
        // map subnet to add name propery
        .map((subnet) => ({
          ...subnet,
          name: `${subnet.ipPools[0].network} - ${subnet.ipPools[0].region}`,
        })),
    ];
  }

  loadSubnets(privateNetwork) {
    this.loadingSubnets = true;
    this.DatabaseService.getSubnets(this.projectId, privateNetwork.id)
      .then((subnets) => {
        this.availableSubnets = this.handleSubnetResponse(subnets);
      })
      .catch(() => {
        this.availableSubnets = [];
      })
      .finally(() => {
        this.loadingSubnets = false;
      });
  }

  loadAvailableNetworks() {
    this.availablePrivateNetworks = [
      this.defaultPrivateNetwork,
      ...this.privateNetworks
        // filter networks in current region with active status
        .filter(
          (network) =>
            network.regions.filter(
              (region) =>
                region.region.startsWith(this.model.region.name) &&
                region.status === 'ACTIVE',
            ).length > 0,
        )
        // map network to add name property
        .map((network) => ({
          ...network,
          name: `${network.vlanId.toString().padStart(4, '0')} - ${
            network.name
          }`,
        }))
        // sort by name
        .sort((a, b) => a.name.localeCompare(b.name)),
    ];
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
        this.model.additionalDiskSize *
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
      this.model.additionalDiskSize *
        additionalDiskPrice *
        this.storageNodeFactor
    );
  }

  get timestampSummary() {
    if (this.model.restoreMode === RESTORE_MODES.BACKUP) {
      return this.backupList.find((backup) => backup.id === this.model.backupId)
        .createdAt;
    }
    if (this.model.restoreMode === RESTORE_MODES.TIMESTAMP) {
      return this.model.timestamp;
    }
    return null;
  }

  get clusterDiskMinAdditionalStorage() {
    // user can not select less than the size of his cluster
    const minDiskSize = this.database.storage.size.value;
    const selectedFlavorMinDisk = this.model.flavor.minDiskSize;
    const minAdditionalStorage = minDiskSize - selectedFlavorMinDisk;
    return Math.max(0, minAdditionalStorage);
  }

  get isForkButtonDisabled() {
    let isRestorePointValid = true;
    if (
      (this.model.restoreMode === RESTORE_MODES.BACKUP &&
        !this.model.backupId) ||
      (this.model.restoreMode === RESTORE_MODES.TIMESTAMP &&
        !this.model.timestamp)
    ) {
      isRestorePointValid = false;
    }
    return (
      !this.isNetworkSelected || this.processingOrder || !isRestorePointValid
    );
  }

  goToAPICommand() {
    this.model.databaseId = this.database.id;
    this.model.disk = {
      initialSize: this.model.flavor.minDiskSize,
      additionalDiskSize: this.model.additionalDiskSize,
    };
    return this.goToCommand(this.model);
  }

  createFork() {
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
    if (this.model.flavor.availabilities[0].stepDiskSize > 0) {
      this.orderData.disk = {
        size: this.model.flavor.minDiskSize + this.model.additionalDiskSize,
      };
    }
    if (this.model.usePrivateNetwork && this.model.subnet?.id?.length > 0) {
      this.orderData.networkId = this.model.privateNetwork.regions?.find(
        (region) => region.region === this.model.subnet?.ipPools[0].region,
      )?.openstackId;
      this.orderData.subnetId = this.model.subnet?.id;
    }

    switch (this.model.restoreMode) {
      case RESTORE_MODES.BACKUP:
        this.orderData.forkFrom = {
          backupId: this.model.backupId,
          serviceId: this.database.id,
        };
        break;
      case RESTORE_MODES.TIMESTAMP:
        this.orderData.forkFrom = {
          serviceId: this.database.id,
          pointInTime: this.model.timestamp,
        };
        break;
      case RESTORE_MODES.SOONEST:
        this.orderData.forkFrom = {
          serviceId: this.database.id,
          pointInTime: moment().toISOString(),
        };
        break;
      default:
        break;
    }

    this.processingOrder = true;
    return this.DatabaseService.createDatabase(
      this.projectId,
      this.model.engine.name,
      this.orderData,
    )
      .then((databaseInfo) => {
        return this.onDatabaseAdd(
          {
            ...databaseInfo,
            engine: this.model.engine.name,
          },
          this.$translate.instant(
            'pci_databases_backups_fork_create_database_success',
          ),
        );
      })
      .catch((error) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_databases_backups_fork_create_database_error',
            {
              message: error.data.message.replace(/"/g, ''),
            },
          ),
          this.messageContainer,
        );
        this.$timeout(() => {
          this.$anchorScroll('addMessages');
        });
        this.processingOrder = false;
      });
  }
}
