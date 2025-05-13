import { DATABASE_TYPES } from '../../../databases.constants';
import { RESTORE_MODES } from '../fork/fork.constants';

export default class {
  /* @ngInject */
  constructor($translate, $filter, DatabaseService) {
    this.$translate = $translate;
    this.$filter = $filter;
    this.service = DatabaseService;
  }

  $onInit() {
    this.trackDashboard('backups::options_menu::restore', 'page');
    this.RESTORE_MODES = RESTORE_MODES;

    this.isPITREnabled =
      this.database.engine === DATABASE_TYPES.MONGO_DB &&
      this.database.plan === 'enterprise';

    this.model = {
      restoreMode: this.isPITREnabled ? this.restoreMode : RESTORE_MODES.BACKUP,
      backupId: this.backupId,
      timestamp: moment().toISOString(),
    };

    const originalFlavor = this.database
      .getEngineFromList(this.engines)
      .getFlavor(
        this.database.version,
        this.database.plan,
        this.database.region,
        this.database.flavor,
      );

    this.calendarOptions = {
      enableSeconds: true,
      minuteIncrement: 1,
      maxDate: moment().toISOString(),
      minDate: moment()
        .subtract(originalFlavor.availabilities[0].backupRetentionDays, 'days')
        .toISOString(),
    };
  }

  get isConfirmButtonDisabled() {
    let isRestorePointValid = true;
    if (
      (this.model.restoreMode === RESTORE_MODES.BACKUP &&
        !this.model.backupId) ||
      (this.model.restoreMode === RESTORE_MODES.TIMESTAMP &&
        !this.model.timestamp)
    ) {
      isRestorePointValid = false;
    }
    return !isRestorePointValid;
  }

  restoreInstance() {
    this.trackDashboard('backups::options_menu::restore_validate');
    this.isLoading = true;

    let promise = null;
    let successMessage = null;
    if (this.model.restoreMode === RESTORE_MODES.BACKUP) {
      const backup = this.backupList.find(
        (backupItem) => backupItem.id === this.model.backupId,
      );
      promise = this.service.restoreBackup(
        this.projectId,
        this.database.engine,
        this.database.id,
        backup.id,
      );
      successMessage = {
        textHtml: this.$translate.instant(
          'pci_databases_backups_restore_backup_success',
          {
            name: backup.description,
            date: this.$filter('date')(backup.createdAt, 'medium'),
          },
        ),
      };
    } else {
      promise = this.service.restoreService(
        this.projectId,
        this.database.engine,
        this.database.id,
        this.model.timestamp,
      );
      successMessage = {
        textHtml: this.$translate.instant(
          'pci_databases_backups_restore_pit_success',
          {
            date: this.$filter('date')(this.model.timestamp, 'medium'),
          },
        ),
      };
    }
    return promise
      .then(() => this.goToDatabase(this.database, successMessage))
      .catch((error) =>
        this.goBack(
          this.$translate.instant('pci_databases_backups_restore_error', {
            message: error.data.message,
          }),
          'error',
        ),
      );
  }

  cancel() {
    this.trackDashboard('backups::options_menu::restore_cancel');
    this.goBack();
  }
}
