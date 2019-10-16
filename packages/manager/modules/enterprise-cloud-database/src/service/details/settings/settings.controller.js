import find from 'lodash/find';
import get from 'lodash/get';
import keys from 'lodash/keys';
import reduce from 'lodash/reduce';
import set from 'lodash/set';

import { MESSAGE_CONTAINER } from '../details.constants';
import { GUIDELINK } from '../../../enterprise-cloud-database.constants';

export default class EnterpriseCloudDatabaseServiceDetailsSettingsCtrl {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    enterpriseCloudDatabaseService,
  ) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.enterpriseCloudDatabaseService = enterpriseCloudDatabaseService;
    this.GUIDELINK = GUIDELINK;
  }

  $onInit() {
    this.data = {
      autoBackup: this.clusterDetails.autoBackup,
      maintenanceWindow: {},
    };
    this.loaders = {
      autoBackup: false,
      maintenanceWindow: false,
    };

    this.rules = {};
    this.CucCloudMessage.flushMessages(MESSAGE_CONTAINER);
    const securityGroup = find(this.securityGroups, { id: this.securityGroupId });
    if (securityGroup) {
      this.toggleRules(securityGroup);
    }
  }

  getMaintenanceWindowConfig() {
    return (this.data.dayOfWeek && this.data.startTime && this.data.duration) ? {
      dayOfWeek: this.data.dayOfWeek,
      startTime: this.data.startTime,
      duration: this.data.duration,
    } : undefined;
  }

  getRules(group) {
    set(group, 'loadingRules', true);
    this.enterpriseCloudDatabaseService.getRulesList(this.clusterDetails.id, group.id)
      .then((rules) => {
        set(this.rules, group.id, rules);
      })
      .catch(error => this.handleError('enterprise_cloud_database_service_details_settings_rules_error', error))
      .finally(() => {
        set(group, 'loadingRules', false);
      });
  }

  handleError(messageId, error) {
    this.CucCloudMessage.error(
      this.$translate.instant(messageId, {
        message: get(error, 'data.message'),
      }),
      MESSAGE_CONTAINER,
    );
  }

  handleSuccess(messageId) {
    this.CucCloudMessage.success(
      this.$translate.instant(messageId),
      MESSAGE_CONTAINER,
    );
  }

  hasMaintenanceWindowChanged() {
    const maintenanceWindowConfig = this.getMaintenanceWindowConfig();
    if (!this.maintenanceWindow && maintenanceWindowConfig) {
      return true;
    }
    return maintenanceWindowConfig
      ? reduce(keys(maintenanceWindowConfig),
        (windowChanged, configKey) => windowChanged || (get(maintenanceWindowConfig, configKey)
          !== get(this.maintenanceWindow, configKey)), false)
      : false;
  }

  isDefaultMaintenanceWindow() {
    const maintenanceWindow = this.getMaintenanceWindowConfig();
    return maintenanceWindow.dayOfWeek === this.regionInfo.maintenanceDayOfWeek
      && maintenanceWindow.startTime === this.regionInfo.maintenanceStartTime
      && maintenanceWindow.duration === this.regionInfo.maintenanceDuration;
  }

  loadRules(group) {
    return get(this.rules, group.id) || this.getRules(group);
  }

  maintenanceWindowChanged(data) {
    Object.assign(this.data, data);
  }

  saveAutoBackup(autoBackup) {
    this.CucCloudMessage.flushMessages(MESSAGE_CONTAINER);
    this.loaders.autoBackup = true;
    this.enterpriseCloudDatabaseService.setClusterDetails(this.clusterDetails.id, {
      autoBackup,
      name: this.data.clusterName,
    }).then(() => this.reload().then(() => this.handleSuccess('enterprise_cloud_database_service_details_settings_save_success')))
      .catch(error => this.handleError('enterprise_cloud_database_service_details_settings_save_error', error))
      .finally(() => { this.loaders.autoBackup = false; });
  }

  saveMaintenanceWindow() {
    this.CucCloudMessage.flushMessages(MESSAGE_CONTAINER);
    this.loaders.maintenanceWindow = true;
    const maintenanceWindowConfig = this.getMaintenanceWindowConfig();
    this.setupMaintenanceWindow(maintenanceWindowConfig)
      .then(() => {
        if (!this.maintenanceWindow) {
          this.maintenanceWindow = {};
        }
        Object.assign(this.maintenanceWindow, maintenanceWindowConfig);
        this.handleSuccess('enterprise_cloud_database_service_details_settings_save_success');
      })
      .catch(error => this.handleError('enterprise_cloud_database_service_details_settings_save_error', error))
      .finally(() => { this.loaders.maintenanceWindow = false; });
  }

  setupMaintenanceWindow(maintenanceWindow) {
    return (this.maintenanceWindow
      ? this.enterpriseCloudDatabaseService
        .updateMaintenanceWindow(this.clusterDetails.id, maintenanceWindow)
      : this.enterpriseCloudDatabaseService
        .createMaintenanceWindow(this.clusterDetails.id, maintenanceWindow));
  }

  toggleRules(group) {
    set(group, 'expanded', !group.expanded);
    if (group.expanded) {
      this.loadRules(group);
    }
  }
}
