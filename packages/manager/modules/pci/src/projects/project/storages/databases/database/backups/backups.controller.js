import { DATABASE_TYPES } from '../../databases.constants';

export default class PciProjectStorageDatabaseBackupsCtrl {
  /* @ngInject */
  constructor(
    CucCloudMessage,
    ovhManagerRegionService,
    DatabaseService,
    $translate,
  ) {
    this.CucCloudMessage = CucCloudMessage;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.DatabaseService = DatabaseService;
    this.$translate = $translate;
  }

  $onInit() {
    this.messageContainer =
      'pci.projects.project.storages.databases.dashboard.backups';
    this.loadMessages();
    this.trackDashboard('backups', 'page');
    this.backupTime = this.database.backupTime;
    const flavor = this.getCurrentFlavor();
    this.backupRetentionTime = moment.duration(
      `P${flavor.availabilities[0].backups.retentionDays}D`,
    );

    this.isEngineVersionDeprecated =
      flavor.isDeprecated || this.database.isOldMongoPlan;
    this.isPITRActivated = this.isFeatureActivated(
      'forkPIT',
      this.database.engine,
    );
    this.isMongoEnterprise =
      this.database.engine === DATABASE_TYPES.MONGO_DB &&
      this.database.plan === 'enterprise';
  }

  get isTopButtonEnabled() {
    return (
      this.database.isActive() &&
      (this.isPITRActivated ||
        this.isMongoEnterprise ||
        this.backupList.length > 0)
    );
  }

  getRegions(backup) {
    let regionString = '-';
    if (backup.regions.length > 0) {
      regionString = backup.regions
        .map((region) =>
          this.ovhManagerRegionService.getTranslatedMacroRegion(region.name),
        )
        .join(', ');
    } else if (backup.region) {
      regionString = this.ovhManagerRegionService.getTranslatedMacroRegion(
        backup.region,
      );
    }
    return regionString;
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

  forkBackup(backup) {
    this.trackDashboard('backups::options_menu::fork');
    this.goToFork(backup, this.database);
  }

  restoreBackup(backup) {
    this.trackDashboard('backups::options_menu::restore');
    this.goToRestore(backup);
  }

  getExpiryDate(backup) {
    return moment(backup.createdAt)
      .add(this.backupRetentionTime)
      .format();
  }

  updateBackupTime() {
    this.trackDashboard('backups::update_backups_time');
    return this.DatabaseService.updateDatabaseEngineProperties(
      this.projectId,
      this.database.engine,
      this.database.id,
      { backupTime: `${this.backupTime}:00` },
    );
  }

  handleBackupTimeSuccess() {
    this.database.updateData({
      backupTime: this.backupTime,
    });
    return this.CucCloudMessage.success(
      this.$translate.instant('pci_databases_backup_time_update_success'),
      this.messageContainer,
    );
  }

  showBackupError() {
    return this.CucCloudMessage.error(
      this.$translate.instant('pci_databases_backup_time_update_error'),
      this.messageContainer,
    );
  }
}
