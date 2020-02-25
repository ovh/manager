import find from 'lodash/find';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import includes from 'lodash/includes';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';

import { DASHBOARD_FEATURES } from './vps-dashboard.constants';
import {
  CHANGE_OWNER_URL,
  CONTACTS_URL,
  IP_URL,
  RENEW_URL,
} from '../constants';

export default class {
  /* @ngInject */
  constructor(
    $filter,
    $q,
    $scope,
    $state,
    $translate,
    coreConfig,
    CucCloudMessage,
    CucControllerHelper,
    CucRegionService,
    VpsService,
  ) {
    this.$filter = $filter;
    this.$q = $q;
    this.$scope = $scope;
    this.$state = $state;
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
    this.VpsService = VpsService;

    this.DASHBOARD_FEATURES = DASHBOARD_FEATURES;
    this.plan = {};
    this.summary = {};
    this.vps = {};

    this.loaders = {
      disk: false,
      ip: false,
      polling: false,
    };
  }

  $onInit() {
    this.initActions();
    this.initLoaders();

    this.vps.load();
    this.summary.load();
    this.plan.load();

    this.$scope.$on('tasks.pending', (event, opt) => {
      if (opt === this.serviceName) {
        this.loaders.polling = true;
      }
    });
    this.$scope.$on('tasks.success', (event, opt) => {
      if (opt === this.serviceName) {
        this.loaders.polling = false;
        this.vps.load();
      }
    });
  }

  initLoaders() {
    this.vps = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.VpsService.getSelectedVps(this.serviceName),
      successHandler: () => {
        this.getRegionsGroup(this.vps.data.location.datacentre);
        if (!this.vps.data.isExpired) {
          this.loadIps();
          this.hasAdditionalDiskOption();
        }
      },
    });
    this.summary = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.VpsService.getTabSummary(this.serviceName, true),
      successHandler: () => this.initOptionsActions(),
    });
    this.plan = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.VpsService.getServiceInfos(this.serviceName).then((plan) => ({
          ...plan,
          creation: moment(plan.creation).format('LL'),
          expiration: moment(plan.expiration).format('LL'),
        })),
    });
  }

  loadIps() {
    this.loaders.ips = true;
    this.VpsService.getIps(this.serviceName).then((ips) => {
      this.vps.data.ipv6Gateway = get(
        find(ips.results, { version: 'v6' }),
        'gateway',
      );
      this.loaders.ips = false;
    });
  }

  hasAdditionalDiskOption() {
    if (!includes(this.vps.data.availableOptions, 'ADDITIONAL_DISK')) {
      this.hasAdditionalDisk = false;
      return this.hasAdditionalDisk;
    }
    return this.loadAdditionalDisks();
  }

  hasFeature(feature) {
    return this.features.includes(feature);
  }

  loadAdditionalDisks() {
    this.loaders.disk = true;
    this.hasAdditionalDisk = true;
    this.VpsService.getDisks(this.serviceName)
      .then((data) => {
        const promises = map(data, (elem) =>
          this.VpsService.getDiskInfo(this.serviceName, elem),
        );
        return this.$q.all(promises).then((diskInfos) => {
          this.additionnalDisks = this.VpsService.showOnlyAdditionalDisk(
            diskInfos,
          );
          this.canOrderDisk = isEmpty(this.additionnalDisks);
        });
      })
      .catch((error) => {
        this.CucCloudMessage.error(
          error || this.$translate.instant('vps_additional_disk_info_fail'),
        );
        return this.$q.reject(error);
      })
      .finally(() => {
        this.loaders.disk = false;
      });
  }

  initBackupStorageActions() {
    this.backupStorageActions = {
      manage: {
        text: this.$translate.instant('vps_common_manage'),
        callback: () =>
          this.$state.go('vps.detail.backup-storage', {
            serviceName: this.serviceName,
          }),
        isAvailable: () => !this.vps.loading,
      },
      order: {
        text: this.$translate.instant('vps_common_order'),
        callback: () =>
          this.$state.go('vps.detail.backup-storage.order', {
            serviceName: this.serviceName,
          }),
        isAvailable: () => !this.vps.loading,
      },
      terminate: {
        text: this.$translate.instant('vps_configuration_desactivate_option'),
        isAvailable: () => !this.vps.loading,
      },
    };
  }

  initSnapshotActions() {
    this.snapshotDescription = this.summary.data.snapshot.creationDate
      ? `${this.$translate.instant(
          'vps_tab_SUMMARY_snapshot_creationdate',
        )} ${moment(this.summary.data.snapshot.creationDate).format('LLL')}`
      : this.$translate.instant('vps_status_enabled');
    this.snapshotActions = {
      delete: {
        text: this.$translate.instant(
          'vps_configuration_delete_snapshot_title_button',
        ),
        isAvailable: () =>
          !this.summary.loading &&
          this.summary.data.snapshot.creationDate &&
          !this.loaders.polling,
      },
      order: {
        text: this.$translate.instant('vps_common_order'),
        callback: () =>
          this.$state.go('vps.detail.snapshot.order', {
            serviceName: this.serviceName,
          }),
        isAvailable: () =>
          !this.summary.loading && this.summary.data.snapshot.optionAvailable,
      },
      restore: {
        text: this.$translate.instant(
          'vps_configuration_snapshot_restore_title_button',
        ),
        isAvailable: () =>
          !this.summary.loading &&
          this.summary.data.snapshot.creationDate &&
          !this.loaders.polling,
      },
      take: {
        text: this.$translate.instant(
          'vps_configuration_snapshot_take_title_button',
        ),
        isAvailable: () =>
          !this.summary.loading &&
          this.summary.data.snapshot.optionActivated &&
          !this.summary.data.snapshot.creationDate &&
          !this.loaders.polling,
      },
      terminate: {
        text: this.$translate.instant('vps_configuration_desactivate_option'),
        isAvailable: () =>
          !this.summary.loading && this.summary.data.snapshot.optionActivated,
      },
    };
  }

  initVeeamActions() {
    this.veeamActions = {
      manage: {
        text: this.$translate.instant('vps_common_manage'),
        callback: () =>
          this.$state.go('vps.detail.veeam', { serviceName: this.serviceName }),
        isAvailable: () => !this.vps.loading,
      },
      order: {
        text: this.$translate.instant('vps_common_order'),
        callback: () =>
          this.$state.go('vps.detail.veeam.order', {
            serviceName: this.serviceName,
          }),
        isAvailable: () => !this.vps.loading,
      },
      terminate: {
        text: this.$translate.instant('vps_configuration_desactivate_option'),
        isAvailable: () => !this.vps.loading,
      },
    };
  }

  initOptionsActions() {
    this.initBackupStorageActions();
    this.initSnapshotActions();
    this.initVeeamActions();
  }

  updateName(newDisplayName) {
    return this.VpsService.updateDisplayName(this.serviceName, newDisplayName)
      .then(() => {
        this.$scope.$emit('changeDescription', newDisplayName);

        return this.$state
          .reload()
          .then(() =>
            this.CucCloudMessage.success(
              this.$translate.instant('vps_setting_name_updated'),
            ),
          );
      })
      .catch((err) => this.CucCloudMessage.error(err));
  }

  initActions() {
    return this.CucControllerHelper.navigation
      .getConstant(get(CHANGE_OWNER_URL, this.coreConfig.getRegion(), {}))
      .then((changeOwnerHref) => {
        this.actions = {
          changeName: {
            text: this.$translate.instant('vps_common_edit'),
            callback: () =>
              this.CucControllerHelper.modal.showNameChangeModal({
                serviceName: this.serviceName,
                displayName: this.vps.data.displayName,
                onSave: (newDisplayName) => this.updateName(newDisplayName),
              }),
            isAvailable: () => !this.vps.loading,
          },
          changeOwner: {
            text: this.$translate.instant('vps_change_owner'),
            atInternetClickTag: 'VPS-Actions-ChangeOwner',
            isAvailable: () => !isEmpty(changeOwnerHref),
            href: changeOwnerHref,
            isExternal: true,
          },
          kvm: {
            text: this.$translate.instant('vps_configuration_kvm_title_button'),
            isAvailable: () => !this.loaders.polling && !this.vps.loading,
          },
          manageAutorenew: {
            text: this.$translate.instant('vps_common_manage'),
            href: this.CucControllerHelper.navigation.constructor.getUrl(
              get(RENEW_URL, this.coreConfig.getRegion()),
              { serviceName: this.serviceName, serviceType: 'VPS' },
            ),
            isAvailable: () =>
              !this.vps.loading &&
              !this.loaders.plan &&
              this.hasFeature(DASHBOARD_FEATURES.autorenew),
            external: !this.coreConfig.isRegion('EU'),
          },
          manageContact: {
            text: this.$translate.instant('vps_common_manage'),
            href: this.CucControllerHelper.navigation.constructor.getUrl(
              get(CONTACTS_URL, this.coreConfig.getRegion()),
              { serviceName: this.serviceName },
            ),
            isAvailable: () => !this.vps.loading,
          },
          manageIps: {
            text: this.$translate.instant(
              'vps_configuration_add_ipv4_title_button',
            ),
            href: this.CucControllerHelper.navigation.constructor.getUrl(
              get(IP_URL, this.coreConfig.getRegion()),
              { serviceName: this.serviceName },
            ),
            isAvailable: () => !this.vps.loading && !this.loaders.ip,
          },
          displayIps: {
            text: this.$translate.instant('vps_dashboard_ips_additional'),
            isAvailable: () => !this.vps.loading && !this.loaders.ip,
          },
          manageSla: {
            text: this.$translate.instant('vps_common_manage'),
            isAvailable: () => !this.vps.loading && !this.loaders.polling,
          },
          viewIpSla: {
            text: this.$translate.instant('vps_dashboard_monitoring_sla_ips'),
            isAvailable: () => !this.vps.loading,
          },
          orderAdditionalDiskOption: {
            text: this.$translate.instant('vps_additional_disk_add_button'),
            callback: () => this.$state.go('vps.detail.additional-disk.order'),
            isAvailable: () => !this.loaders.disk && this.canOrderDisk,
          },
          orderWindows: {
            text: this.$translate.instant('vps_common_order'),
            callback: () =>
              this.$state.go('vps.detail.windows.order', {
                serviceName: this.serviceName,
              }),
            isAvailable: () =>
              !this.summary.loading && !this.summary.windowsActivated,
          },
          reboot: {
            text: this.$translate.instant(
              'vps_configuration_reboot_title_button',
            ),
            isAvailable: () => !this.loaders.polling && !this.vps.loading,
          },
          rebuild: {
            callback: () =>
              this.$state.go('vps.detail.dashboard.rebuild', {
                serviceName: this.serviceName,
              }),
            isAvailable: () =>
              !this.loaders.polling &&
              !this.vps.loading &&
              this.hasFeature(DASHBOARD_FEATURES.rebuild),
          },
          reinstall: {
            text: this.$translate.instant(
              'vps_configuration_reinstall_title_button',
            ),
            isAvailable: () =>
              !this.loaders.polling &&
              !this.vps.loading &&
              this.hasFeature(DASHBOARD_FEATURES.reinstall),
          },
          rebootRescue: {
            text: this.$translate.instant('vps_configuration_reboot_rescue'),
            isAvailable: () => !this.loaders.polling && !this.vps.loading,
          },
          reverseDns: {
            text: this.$translate.instant(
              'vps_configuration_reversedns_title_button',
            ),
            isAvailable: () => !this.loaders.ip,
          },
          terminate: {
            callback: () => this.$state.go('vps.detail.dashboard.terminate'),
            isAvailable: () => !this.vps.loading,
          },
          terminateAdditionalDiskOption: {
            text: this.$translate.instant(
              'vps_configuration_desactivate_option',
            ),
            isAvailable: () => !this.loaders.disk && !this.canOrderDisk,
          },
          terminateWindows: {
            text: this.$translate.instant(
              'vps_configuration_desactivate_option',
            ),
            isAvailable: () =>
              !this.summary.loading && this.summary.data.windowsActivated,
          },
          upgrade: {
            text: this.$translate.instant(
              'vps_configuration_upgradevps_title_button',
            ),
            state: 'vps.detail.upgrade',
            stateParams: { serviceName: this.serviceName },
            isAvailable: () => !this.loaders.polling && !this.vps.loading,
          },
        };
      });
  }

  getRegionsGroup(regions) {
    this.regionsGroup = [];
    if (regions) {
      this.detailedRegions = !isArray(regions)
        ? [this.CucRegionService.getRegion(regions)]
        : map(regions, (region) => this.CucRegionService.getRegion(region));
    }
    this.regionsGroup = groupBy(this.detailedRegions, 'country');
  }

  hasMultipleRegions() {
    return isArray(this.detailedRegions) && this.detailedRegions.length > 1;
  }

  static getActionStateParamString(params) {
    return params ? `(${JSON.stringify(params)})` : '';
  }
}
