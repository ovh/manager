import {
  SUCCESS_STATUS,
  ERROR_STATUS,
  WARNING_STATUS,
} from './maintenance.constants';

export default class PciProjectStorageDatabaseMaintenanceCtrl {
  /* @ngInject */
  constructor($translate, DatabaseService, CucCloudMessage) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.DatabaseService = DatabaseService;
    this.SUCCESS_STATUS = SUCCESS_STATUS;
    this.WARNING_STATUS = WARNING_STATUS;
    this.ERROR_STATUS = ERROR_STATUS;
  }

  $onInit() {
    this.trackDashboard('maintenances', 'page');
    this.messageContainer = `pci.projects.project.storages.databases.dashboard.maintenances`;
    this.loadMessages();
    this.maintenanceTime = this.database.maintenanceTime;
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(this.messageContainer);
    this.messageHandler = this.CucCloudMessage.subscribe(
      this.messageContainer,
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  applyMaintenance(maintenance) {
    this.trackDashboard('maintenances::apply_maintenance');
    this.DatabaseService.applyMaintenance(
      this.projectId,
      this.database.engine,
      this.database.id,
      maintenance.id,
    )
      .then(() => {
        this.refreshMaintenances();
        this.CucCloudMessage.success(
          this.$translate.instant(
            'pci_databases_maintenances_maintenance_apply_success',
          ),
          this.messageContainer,
        );
      })
      .catch(() => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_databases_maintenances_maintenance_apply_error',
          ),
          this.messageContainer,
        );
      });
  }

  refreshMaintenances() {
    this.refreshing = true;
    this.DatabaseService.getMaintenances(
      this.projectId,
      this.database.engine,
      this.database.id,
    )
      .then((maintenances) => {
        this.maintenances = maintenances;
      })
      .finally(() => {
        this.refreshing = false;
      });
  }

  updateMaintenanceTime() {
    this.trackDashboard('maintenances::update_maintenance_time');
    return this.DatabaseService.updateDatabaseEngineProperties(
      this.projectId,
      this.database.engine,
      this.database.id,
      { maintenanceTime: `${this.maintenanceTime}:00` },
    );
  }

  handleMaintenanceTimeSuccess() {
    this.database.updateData({
      maintenanceTime: this.maintenanceTime,
    });
    return this.CucCloudMessage.success(
      this.$translate.instant('pci_databases_maintenances_update_time_success'),
      this.messageContainer,
    );
  }

  showMaintenanceError() {
    return this.CucCloudMessage.error(
      this.$translate.instant('pci_databases_maintenances_update_time_error'),
      this.messageContainer,
    );
  }
}
