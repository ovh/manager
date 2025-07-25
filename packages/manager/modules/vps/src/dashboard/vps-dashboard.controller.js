import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import 'moment';
import { RANGES } from '../upscale/upscale.constants';
import {
  ADD_DOMAIN_LINK_SUFFIX_URL,
  VPS_RANGE_COMPARE_LINKS,
  COMMIT_IMPRESSION_TRACKING_DATA,
  DASHBOARD_FEATURES,
  MIGRATION_STATUS,
  RECOMMIT_IMPRESSION_TRACKING_DATA,
  SERVICE_TYPE,
  VPS_MIGRATION_FAQ_LINKS,
} from './vps-dashboard.constants';

import { CHANGE_OWNER_URL, RENEW_URL } from '../vps/constants';

export default class {
  /* @ngInject */
  constructor(
    $filter,
    $q,
    $scope,
    $state,
    $translate,
    coreConfig,
    coreURLBuilder,
    CucCloudMessage,
    CucControllerHelper,
    ovhManagerRegionService,
    VpsService,
    VpsHelperService,
    VpsUpgradeService,
    RedirectionService,
  ) {
    this.$filter = $filter;
    this.$q = $q;
    this.$scope = $scope;
    this.$state = $state;
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.coreURLBuilder = coreURLBuilder;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.VpsService = VpsService;
    this.VpsHelperService = VpsHelperService;
    this.VpsUpgradeService = VpsUpgradeService;
    this.ADD_DOMAIN_LINK = `${RedirectionService.getURL(
      'order',
    )}${ADD_DOMAIN_LINK_SUFFIX_URL}`;
    this.DASHBOARD_FEATURES = DASHBOARD_FEATURES;
    this.SERVICE_TYPE = SERVICE_TYPE;
    this.COMMIT_IMPRESSION_TRACKING_DATA = COMMIT_IMPRESSION_TRACKING_DATA;
    this.RECOMMIT_IMPRESSION_TRACKING_DATA = RECOMMIT_IMPRESSION_TRACKING_DATA;

    this.loaders = {
      ip: false,
      polling: false,
    };

    this.migrationFAQLink =
      VPS_MIGRATION_FAQ_LINKS[coreConfig.getUser().ovhSubsidiary] ||
      VPS_MIGRATION_FAQ_LINKS.DEFAULT;
  }

  $onInit() {
    this.expirationDate = moment(this.serviceInfo?.expiration).format('LL');
    this.migrationDate = moment(this.vpsMigration?.date).format('LLL');
    this.vpsMigrationData = {
      inAutoMigrationPhase:
        this.vpsMigration.status === MIGRATION_STATUS.ONGOING,
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

  static getSimpleRangeName(rangeFullName) {
    const rangesKeys = Object.values(RANGES).join('|');
    const [simpleRangeName] =
      rangeFullName.match(new RegExp(rangesKeys, 'i')) || [];
    return simpleRangeName?.toLocaleLowerCase();
  }

  canBeMigrated() {
    return [MIGRATION_STATUS.AVAILABLE, MIGRATION_STATUS.PLANNED].includes(
      this.vpsMigration?.status,
    );
  }

  isStarter() {
    return this.stateVps?.model?.name.includes(
      RANGES.STARTER.toLocaleLowerCase(),
    );
  }

  getTrackingProductLine() {
    if (this.stateVps?.model?.name) {
      const model = this.constructor.getSimpleRangeName(
        this.stateVps?.model?.name,
      );
      return `vps_${model}`;
    }
    return '';
  }

  getRangeCompareLink() {
    return (
      VPS_RANGE_COMPARE_LINKS[this.coreConfig.getUser()?.ovhSubsidiary] ||
      VPS_RANGE_COMPARE_LINKS.links.DEFAULT
    );
  }

  $onDestroy() {
    if (this.vpsUpgradeTask) {
      this.VpsUpgradeService.stopUpgradeTaskPolling();
      this.vpsUpgradeTask = null;
    }
  }

  initLoaders() {
    this.getRegionsGroup(this.vps.location.datacentre);
    if (!this.vps.isExpired) {
      this.loadIps();
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
      this.VpsUpgradeService.startUpgradeTaskPolling(
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
      this.vps.ipv6Gateway = ips.find(
        ({ version }) => version === 'v6',
      )?.gateway;
      this.loaders.ips = false;
    });
  }

  hasFeature(feature) {
    return this.features.includes(feature);
  }

  onBillingInformationError(error) {
    return this.CucCloudMessage.error(error);
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
    this.snapshotDescription = this.tabSummary.snapshot?.creationDate
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
      download: {
        text: this.$translate.instant(
          'vps_configuration_download_snapshot_title_button',
        ),
        callback: () =>
          this.$state.go('vps.detail.snapshot.download', {
            serviceName: this.serviceName,
          }),
        isAvailable: () =>
          this.tabSummary.snapshot.optionAvailable &&
          this.tabSummary.snapshot.creationDate &&
          !this.loaders.polling &&
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

    if (this.tabSummary.veeam.optionActivated) {
      this.backupList();
    }
  }

  backupList() {
    this.VpsService.getTabVeeam(this.serviceName, 'available').then(
      (backups) => {
        this.lastBackup =
          backups[0] &&
          `${this.$translate.instant(
            'vps_tab_SUMMARY_snapshot_creationdate',
          )} ${moment(backups[0])
            .utc()
            .format('LLL')}`;
      },
    );
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
            href: this.coreConfig.isRegion('EU')
              ? this.coreURLBuilder.buildURL(
                  'dedicated',
                  '#/billing/autoRenew',
                  {
                    selectedType: 'VPS',
                    searchText: this.serviceName,
                  },
                )
              : this.CucControllerHelper.navigation.constructor.getUrl(
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
            href: this.coreConfig.isRegion('EU')
              ? this.coreURLBuilder.buildURL(
                  'dedicated',
                  '#/contacts/services',
                  {
                    tab: 'SERVICES',
                    serviceName: this.serviceName,
                  },
                )
              : null,
            isAvailable:
              this.coreConfig.isRegion('EU') && !this.isMigrationInProgress,
          },
          manageIps: {
            text: this.$translate.instant(
              'vps_configuration_add_ipv4_title_button',
            ),
            href: this.coreURLBuilder.buildURL(
              'dedicated',
              '#/configuration/ip',
              {
                landingTo: 'ip',
                serviceName: this.serviceName,
              },
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
            isAvailable: () => !this.engagement?.isPeriodic(),
          },
          terminateWindows: {
            text: this.$translate.instant(
              'vps_configuration_desactivate_option',
            ),
            isAvailable: () =>
              this.tabSummary.windowsActivated && !this.isMigrationInProgress,
          },
        };
      });
  }

  getRegionsGroup(regions) {
    let detailedRegions = [];
    if (regions) {
      detailedRegions = !isArray(regions)
        ? [this.ovhManagerRegionService.getRegion(regions)]
        : map(regions, (region) =>
            this.ovhManagerRegionService.getRegion(region),
          );
    }
    this.regionsGroup = groupBy(detailedRegions, 'country');
  }

  static getActionStateParamString(params) {
    return params ? `(${JSON.stringify(params)})` : '';
  }
}
