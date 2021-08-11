import { graphs } from '../details/metrics.constant';
import { RENEW_URL } from './constants';

export default class MetricsDashboardCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $stateParams,
    $q,
    $translate,
    coreConfig,
    coreURLBuilder,
    CucCloudMessage,
    CucControllerHelper,
    CucFeatureAvailabilityService,
    ovhManagerRegionService,
    MetricService,
    SidebarMenu,
  ) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$q = $q;
    this.$translate = $translate;
    this.serviceName = $stateParams.serviceName;
    this.coreConfig = coreConfig;
    this.coreURLBuilder = coreURLBuilder;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.CucFeatureAvailabilityService = CucFeatureAvailabilityService;
    this.MetricService = MetricService;
    this.graphs = graphs;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.SidebarMenu = SidebarMenu;

    this.loading = {};
    this.limit = {
      warning: 70,
      danger: 85,
    };
    this.usage = {};
    this.configuration = {};
    this.plan = {};
    this.actions = {};
  }

  $onInit() {
    this.loading.service = true;
    this.loading.consumption = true;
    this.loading.plan = true;
    this.initTiles();
  }

  initTiles() {
    this.initActions();
    this.MetricService.getService(this.serviceName)
      .then((service) => {
        this.usage.quota = {
          mads: service.data.quota.mads,
          ddp: service.data.quota.ddp,
        };
        this.configuration = {
          name: service.data.name,
          description: service.data.description,
          retention: service.data.quota.retention,
          datacenter: this.transformRegion(service.data.region.name),
        };
        this.plan.offer = service.data.offer;
      })
      .finally(() => {
        this.loading.service = false;
      });

    this.MetricService.getConsumption(this.serviceName)
      .then((cons) => {
        this.usage.conso = { mads: cons.data.mads, ddp: cons.data.ddp };
        this.initMessages();
      })
      .finally(() => {
        this.loading.consumption = false;
      });

    this.MetricService.getServiceInfos(this.serviceName)
      .then((info) => {
        this.plan = info.data;
        return this.MetricService.getService(this.serviceName);
      })
      .then((service) => {
        this.plan.offer = service.data.offer;
      })
      .finally(() => {
        this.loading.plan = false;
      });
  }

  initMessages() {
    if (
      this.constructor.computeUsage(
        this.usage.conso.mads,
        this.usage.quota.mads,
      ) > this.limit.warning
    ) {
      this.CucCloudMessage.warning(
        this.$translate.instant('metrics_quota_mads_warning_message'),
      );
    }
    if (
      this.constructor.computeUsage(
        this.usage.conso.ddp,
        this.usage.quota.ddp,
      ) > this.limit.warning
    ) {
      this.CucCloudMessage.warning(
        this.$translate.instant('metrics_quota_ddp_warning_message'),
      );
    }
  }

  initActions() {
    this.actions = {
      autorenew: {
        text: this.$translate.instant('metrics_manage'),
        href: this.coreConfig.isRegion('EU')
          ? this.coreURLBuilder.buildURL('dedicated', '#/billing/autoRenew', {
              selectedType: 'METRICS',
              searchText: this.serviceName,
            })
          : RENEW_URL[this.coreConfig.getRegion()],
        isAvailable: () => true,
      },
      contacts: {
        text: this.$translate.instant('metrics_manage'),
        href: this.coreConfig.isRegion('EU')
          ? this.coreURLBuilder.buildURL('dedicated', '#/contacts/services', {
              tab: 'SERVICES',
              serviceName: this.serviceName,
            })
          : null,
        isAvailable: () =>
          this.CucFeatureAvailabilityService.hasFeature('CONTACTS', 'manage'),
      },
      editName: {
        text: this.$translate.instant('metrics_tiles_modify'),
        callback: () => this.showEditName(this.configuration.description),
        isAvailable: () => true,
      },
    };
  }

  static computeUsage(value, total) {
    return (value / total) * 100;
  }

  static displayUsage(value, total) {
    if (!value && !total) {
      return '0';
    }
    return `${value}/${total}`;
  }

  computeColor(value, total) {
    const green = '#B0CA67';
    const yellow = '#E3CD4D';
    const red = '#B04020';
    if (this.constructor.computeUsage(value, total) > this.limit.danger) {
      return red;
    }
    if (this.constructor.computeUsage(value, total) > this.limit.warning) {
      return yellow;
    }
    return green;
  }

  transformRegion(regionCode) {
    const region = this.ovhManagerRegionService.getRegion(regionCode);
    return {
      name: region.microRegion.text,
      country: region.country,
      flag: region.icon,
    };
  }

  updateName(newDisplayName) {
    return this.MetricService.setServiceDescription(
      this.serviceName,
      newDisplayName,
    ).then((result) => {
      this.configuration.description = result.data.description;
      this.$scope.$emit('changeDescription', this.configuration.description);

      const menuItem = this.SidebarMenu.getItemById(this.serviceName);
      menuItem.title = this.configuration.description;
    });
  }

  showEditName(name) {
    this.CucControllerHelper.modal.showNameChangeModal({
      serviceName: this.serviceName,
      displayName: name,
      onSave: (newDisplayName) => this.updateName(newDisplayName),
    });
  }
}
