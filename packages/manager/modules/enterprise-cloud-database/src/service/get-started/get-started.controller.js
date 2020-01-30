import find from 'lodash/find';
import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import set from 'lodash/set';
import { GUIDELINK } from '../../enterprise-cloud-database.constants';

export default class EnterpriseCloudDatabaseServiceGetStartedCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    CucCloudMessage,
    CucControllerHelper,
    enterpriseCloudDatabaseService,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.CucControllerHelper = CucControllerHelper;
    this.enterpriseCloudDatabaseService = enterpriseCloudDatabaseService;
    this.GUIDELINK = GUIDELINK;
  }

  $onInit() {
    this.stepperIndex = 0;
    this.data = {
      clusterName: this.clusterDetails.name,
      dailyBackup: false,
      replicaConfig: {
        replicaCount: 0,
      },
    };
    this.loaders = {
      savingSecuritySettings: false,
      savingSettings: false,
    };

    this.loadMessages();
  }

  dataChanged(data) {
    Object.assign(this.data, data);
  }

  getMaintenanceWindowConfig() {
    return this.data.dayOfWeek && this.data.startTime && this.data.duration
      ? {
          dayOfWeek: this.data.dayOfWeek,
          startTime: this.data.startTime,
          duration: this.data.duration,
        }
      : undefined;
  }

  getMaintenanceWindowToSave() {
    const maintenanceWindow = this.getMaintenanceWindowConfig();
    return this.isDefaultMaintenanceWindow(maintenanceWindow) &&
      !this.maintenanceWindow
      ? undefined
      : maintenanceWindow;
  }

  getSecurityGroup(name) {
    const securityGroup = find(this.securityGroups, { name });
    return isUndefined(securityGroup)
      ? this.enterpriseCloudDatabaseService
          .createSecurityGroup(this.clusterDetails.id, name)
          .then((newSecurityGroup) => newSecurityGroup.data)
      : this.$q.when(securityGroup);
  }

  gotoAddReplicas() {
    this.addReplicas(this.replicaConfigChanged.bind(this));
  }

  handleError(error) {
    this.CucCloudMessage.error(
      this.$translate.instant(
        'enterprise_cloud_database_service_get_started_settings_save_error',
        {
          message: get(error, 'data.message'),
        },
      ),
    );
    this.CucControllerHelper.scrollPageToTop();
  }

  isDefaultMaintenanceWindow(maintenanceWindow) {
    return (
      maintenanceWindow.dayOfWeek === this.regionInfo.maintenanceDayOfWeek &&
      maintenanceWindow.startTime === this.regionInfo.maintenanceStartTime &&
      maintenanceWindow.duration === this.regionInfo.maintenanceDuration
    );
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }

  replicaConfigChanged(data) {
    this.dataChanged({ replicaConfig: data });
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(
      'enterprise-cloud-database.service.get-started',
    );
    this.messageHandler = this.CucCloudMessage.subscribe(
      'enterprise-cloud-database.service.get-started',
      { onMessage: () => this.refreshMessage() },
    );
  }

  saveSecurityInfo(form) {
    if (!get(form, '$valid')) {
      return false;
    }
    set(form, '$valid', false);
    this.CucCloudMessage.flushMessages(
      'enterprise-cloud-database.service.get-started',
    );
    this.loaders.savingSecuritySettings = true;
    return this.$q
      .all([
        this.enterpriseCloudDatabaseService.setClusterDetails(
          this.clusterDetails.id,
          {
            autoBackup: this.clusterDetails.autoBackup,
            name: this.data.clusterName,
          },
        ),
        this.enterpriseCloudDatabaseService.setUserPassword(
          this.clusterDetails.id,
          this.data.clusterPassword,
        ),
        this.getSecurityGroup(this.data.securityGroupName).then(
          (securityGroup) =>
            this.enterpriseCloudDatabaseService.createRule(
              this.clusterDetails.id,
              securityGroup.id,
              this.data.rule,
            ),
        ),
      ])
      .then(() => {
        this.stepperIndex += 1;
        set(form, '$valid', true);
      })
      .catch((error) => this.handleError(error))
      .finally(() => {
        this.loaders.savingSecuritySettings = false;
      });
  }

  saveSettings(form) {
    set(form, '$valid', false);
    this.CucCloudMessage.flushMessages(
      'enterprise-cloud-database.service.get-started',
    );
    this.loaders.savingSettings = true;
    const newMaintenanceWindow = this.getMaintenanceWindowToSave();
    return this.$q
      .all([
        this.data.replicaConfig.replicaCount
          ? this.enterpriseCloudDatabaseService
              .orderAddons(
                this.clusterDetails.id,
                this.data.replicaConfig.replicaCount,
              )
              .then(() => this.enterpriseCloudDatabaseService.resetHostsCache())
          : this.$q.when(0),
        this.enterpriseCloudDatabaseService.setClusterDetails(
          this.clusterDetails.id,
          {
            autoBackup: this.data.dailyBackup,
            name: this.data.clusterName,
          },
        ),
        newMaintenanceWindow
          ? this.setupMaintenanceWindow(newMaintenanceWindow)
          : this.$q.when(0),
      ])
      .then(() => {
        this.stepperIndex += 1;
        set(form, '$valid', true);
        this.gotoClusterDetails();
      })
      .catch((error) => this.handleError(error))
      .finally(() => {
        this.loaders.savingSettings = false;
      });
  }

  setupMaintenanceWindow(maintenanceWindow) {
    return this.maintenanceWindow
      ? this.enterpriseCloudDatabaseService.updateMaintenanceWindow(
          this.clusterDetails.id,
          maintenanceWindow,
        )
      : this.enterpriseCloudDatabaseService.createMaintenanceWindow(
          this.clusterDetails.id,
          maintenanceWindow,
        );
  }
}
