import find from 'lodash/find';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import 'moment';

import {
  DASHBOARD_FEATURES,
  VPS_2014_AUTO_MIGRATION_DATE,
} from './vps-dashboard.constants';
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
    vpsUpgradeTile,
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
    this.vpsUpgradeTile = vpsUpgradeTile;
    this.DASHBOARD_FEATURES = DASHBOARD_FEATURES;

    this.loaders = {
      disk: false,
      ip: false,
      polling: false,
    };
  }

  $onInit() {
    this.vps2014MigrationData = {
      autoMigrationDate: moment(
        VPS_2014_AUTO_MIGRATION_DATE,
        'DD-MM-YYYY',
      ).format('LL'),
      inAutoMigrationPhase: moment().isSameOrAfter(
        moment(VPS_2014_AUTO_MIGRATION_DATE, 'DD/MM/YYYY'),
      ),
      migrationScheduledInDays:
        this.vpsMigrationTask && this.vpsMigrationTask.date
          ? moment(this.vpsMigrationTask.date).diff(moment(), 'days')
          : null,
    };
    this.isMigrationInProgress =
      this.vpsMigrationTask && this.vpsMigrationTask.state !== 'todo';
    this.initActions();
    this.initLoaders();
    this.initUpgradePolling();

    this.$scope.$on('tasks.pending', (event, opt) => {
      if (opt === this.serviceName) {
        this.loaders.polling = true;
      }
    });
    this.$scope.$on('tasks.success', (event, opt) => {
      if (opt === this.serviceName) {
        this.loaders.polling = false;
        this.$state.reload();
      }
    });
  }

  $onDestroy() {
    if (this.vpsUpgradeTask) {
      this.vpsUpgradeTile.stopUpgradeTaskPolling();
      this.vpsUpgradeTask = null;
    }
  }

  initLoaders() {
    this.getRegionsGroup(this.vps.location.datacentre);
    if (!this.vps.isExpired) {
      this.loadIps();
      this.hasAdditionalDiskOption();
    }

    if (!isArray(this.tabSummary) && this.tabSummary.code !== 400) {
      this.initOptionsActions();
    } else {
      this.CucCloudMessage.error(
        `${this.$translate.instant(
          'vps_dashboard_loading_error',
        )} ${this.tabSummary.map(({ message }) => message)}`,
      );
    }
  }

  initUpgradePolling() {
    if (this.vpsUpgradeTask && !this.vpsMigrationTask) {
      this.vpsUpgradeTile.startUpgradeTaskPolling(
        this.serviceName,
        this.vpsUpgradeTask,
        {
          onItemDone: ({ state }) => {
            this.CucCloudMessage.flushMessages();

            this.goBack(
              this.$translate.instant(`vps_dashboard_upgrade_${state}`),
              state === 'done' ? 'success' : 'error',
              {},
              { reload: true },
            );
          },
          onItemUpdated: () => {
            this.CucCloudMessage.info(
              this.$translate.instant('vps_dashboard_upgrade_doing'),
            );
          },
        },
      );
    }
  }

  loadIps() {
    this.loaders.ips = true;
    this.VpsService.getIps(this.serviceName).then((ips) => {
      this.vps.ipv6Gateway = get(
        find(ips.results, { version: 'v6' }),
        'gateway',
      );
      this.loaders.ips = false;
    });
  }

  hasAdditionalDiskOption() {
    if (
      !this.tabSummary.additionalDisk ||
      !this.tabSummary.additionalDisk.optionAvailable
    ) {
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
      },
      order: {
        text: this.$translate.instant('vps_common_order'),
        callback: () =>
          this.$state.go('vps.detail.backup-storage.order', {
            serviceName: this.serviceName,
          }),
      },
      terminate: {
        text: this.$translate.instant('vps_configuration_desactivate_option'),
      },
    };
  }

  initSnapshotActions() {
    this.snapshotDescription = this.tabSummary.snapshot.creationDate
      ? `${this.$translate.instant(
          'vps_tab_SUMMARY_snapshot_creationdate',
        )} ${moment(this.tabSummary.snapshot.creationDate).format('LLL')}`
      : this.$translate.instant('vps_status_enabled');
    this.snapshotActions = {
      delete: {
        text: this.$translate.instant(
          'vps_configuration_delete_snapshot_title_button',
        ),
        isAvailable: () =>
          this.tabSummary.snapshot.creationDate &&
          !this.loaders.polling &&
          !this.isMigrationInProgress,
      },
      order: {
        text: this.$translate.instant('vps_common_order'),
        callback: () =>
          this.$state.go('vps.detail.snapshot.order', {
            serviceName: this.serviceName,
          }),
        isAvailable: () =>
          this.tabSummary.snapshot.optionAvailable &&
          !this.isMigrationInProgress,
      },
      restore: {
        text: this.$translate.instant(
          'vps_configuration_snapshot_restore_title_button',
        ),
        isAvailable: () =>
          this.tabSummary.snapshot.creationDate &&
          !this.loaders.polling &&
          !this.isMigrationInProgress,
      },
      take: {
        text: this.$translate.instant(
          'vps_configuration_snapshot_take_title_button',
        ),
        isAvailable: () =>
          this.tabSummary.snapshot.optionActivated &&
          !this.tabSummary.snapshot.creationDate &&
          !this.loaders.polling &&
          !this.isMigrationInProgress,
      },
      terminate: {
        text: this.$translate.instant('vps_configuration_desactivate_option'),
        isAvailable: () =>
          this.tabSummary.snapshot.optionActivated &&
          !this.isMigrationInProgress,
      },
    };
  }

  initVeeamActions() {
    this.veeamActions = {
      manage: {
        text: this.$translate.instant('vps_common_manage'),
        callback: () =>
          this.$state.go('vps.detail.veeam', { serviceName: this.serviceName }),
      },
      order: {
        text: this.$translate.instant('vps_common_order'),
        callback: () =>
          this.$state.go('vps.detail.veeam.order', {
            serviceName: this.serviceName,
          }),
      },
      terminate: {
        text: this.$translate.instant('vps_configuration_desactivate_option'),
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
            text: this.$translate.instant('vps_dashboard_display_name_edit'),
            callback: () =>
              this.CucControllerHelper.modal.showNameChangeModal({
                serviceName: this.serviceName,
                displayName: this.vps.displayName,
                onSave: (newDisplayName) => this.updateName(newDisplayName),
              }),
          },
          changeOwner: {
            text: this.$translate.instant('vps_change_owner'),
            atInternetClickTag: 'VPS-Actions-ChangeOwner',
            isAvailable: () =>
              !isEmpty(changeOwnerHref) && !this.isMigrationInProgress,
            href: changeOwnerHref,
            isExternal: true,
          },
          kvm: {
            text: this.$translate.instant('vps_configuration_kvm_title_button'),
            isAvailable: () =>
              !this.loaders.polling && !this.isMigrationInProgress,
          },
          manageAutorenew: {
            text: this.$translate.instant('vps_common_manage'),
            href: this.CucControllerHelper.navigation.constructor.getUrl(
              get(RENEW_URL, this.coreConfig.getRegion()),
              { serviceName: this.serviceName, serviceType: 'VPS' },
            ),
            isAvailable: () =>
              !this.loaders.plan &&
              this.hasFeature(DASHBOARD_FEATURES.autorenew) &&
              !this.isMigrationInProgress,
            external: !this.coreConfig.isRegion('EU'),
          },
          manageContact: {
            text: this.$translate.instant('vps_common_manage'),
            href: this.CucControllerHelper.navigation.constructor.getUrl(
              get(CONTACTS_URL, this.coreConfig.getRegion()),
              { serviceName: this.serviceName },
            ),
            isAvailable:
              this.coreConfig.isRegion('EU') && !this.isMigrationInProgress,
          },
          manageIps: {
            text: this.$translate.instant(
              'vps_configuration_add_ipv4_title_button',
            ),
            href: this.CucControllerHelper.navigation.constructor.getUrl(
              get(IP_URL, this.coreConfig.getRegion()),
              { serviceName: this.serviceName },
            ),
            isAvailable: () => !this.loaders.ip && !this.isMigrationInProgress,
          },
          displayIps: {
            text: this.$translate.instant('vps_dashboard_ips_additional'),
            isAvailable: () => !this.loaders.ip && !this.isMigrationInProgress,
          },
          manageSla: {
            text: this.$translate.instant('vps_common_manage'),
            isAvailable: () =>
              !this.loaders.polling && !this.isMigrationInProgress,
          },
          viewIpSla: {
            text: this.$translate.instant('vps_dashboard_monitoring_sla_ips'),
          },
          orderAdditionalDiskOption: {
            text: this.$translate.instant('vps_additional_disk_add_button'),
            callback: () => this.$state.go('vps.detail.additional-disk.order'),
            isAvailable: () =>
              !this.loaders.disk &&
              this.canOrderDisk &&
              !this.isMigrationInProgress,
          },
          orderWindows: {
            text: this.$translate.instant('vps_common_order'),
            callback: () =>
              this.$state.go('vps.detail.windows.order', {
                serviceName: this.serviceName,
              }),
            isAvailable: () =>
              !this.tabSummary.windows.optionActivated &&
              !this.isMigrationInProgress,
          },
          reboot: {
            text: this.$translate.instant(
              'vps_configuration_reboot_title_button',
            ),
            isAvailable: () =>
              !this.loaders.polling && !this.isMigrationInProgress,
          },
          rebuild: {
            callback: () =>
              this.$state.go('vps.detail.dashboard.rebuild', {
                serviceName: this.serviceName,
              }),
            isAvailable: () =>
              !this.loaders.polling &&
              !this.isMigrationInProgress &&
              (this.hasFeature(DASHBOARD_FEATURES.rebuild) ||
                this.isVpsNewRange),
          },
          reinstall: {
            text: this.$translate.instant(
              'vps_configuration_reinstall_title_button',
            ),
            isAvailable: () =>
              !this.loaders.polling &&
              this.hasFeature(DASHBOARD_FEATURES.reinstall) &&
              !this.isVpsNewRange &&
              !this.isMigrationInProgress,
          },
          rebootRescue: {
            text: this.$translate.instant('vps_configuration_reboot_rescue'),
            isAvailable: () =>
              !this.loaders.polling && !this.isMigrationInProgress,
          },
          reverseDns: {
            text: this.$translate.instant(
              'vps_configuration_reversedns_title_button',
            ),
            isAvailable: () => !this.loaders.ip && !this.isMigrationInProgress,
          },
          terminate: {
            callback: () => this.$state.go('vps.detail.dashboard.terminate'),
          },
          terminateAdditionalDiskOption: {
            text: this.$translate.instant(
              'vps_configuration_desactivate_option',
            ),
            isAvailable: () =>
              !this.loaders.disk &&
              !this.canOrderDisk &&
              !this.isMigrationInProgress,
          },
          terminateWindows: {
            text: this.$translate.instant(
              'vps_configuration_desactivate_option',
            ),
            isAvailable: () =>
              this.tabSummary.windowsActivated && !this.isMigrationInProgress,
          },
          upgrade: {
            text: this.$translate.instant(
              'vps_configuration_upgradevps_title_button',
            ),
            state: 'vps.detail.upgrade',
            stateParams: { serviceName: this.serviceName },
            isAvailable: () =>
              !this.loaders.polling &&
              !this.isVpsNewRange &&
              !this.isMigrationInProgress,
          },
        };
      });
  }

  getRegionsGroup(regions) {
    let detailedRegions = [];
    if (regions) {
      detailedRegions = !isArray(regions)
        ? [this.CucRegionService.getRegion(regions)]
        : map(regions, (region) => this.CucRegionService.getRegion(region));
    }
    this.regionsGroup = groupBy(detailedRegions, 'country');
  }

  static getActionStateParamString(params) {
    return params ? `(${JSON.stringify(params)})` : '';
  }
}
