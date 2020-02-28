import get from 'lodash/get';

import {
  BACKUP_STATE_DISABLED,
  BACKUP_OFFER_LEGACY,
  BACKUP_OFFER_ADVANCED,
  BACKUP_OFFER_PREMIUM,
} from './backup.constants';

export default class Backup {
  constructor(backup) {
    Object.assign(this, backup);
    this.initializeBackup();
  }

  initializeBackup() {
    this.backupSizeInReport = this.backupSizeInReport
      ? this.backupSizeInReport
      : false;
    this.fullDayInReport = this.fullDayInReport ? this.fullDayInReport : false;
    this.restorePointInReport = this.restorePointInReport
      ? this.restorePointInReport
      : false;
    this.diskSizeInReport = this.diskSizeInReport
      ? this.diskSizeInReport
      : false;
    this.encryption = this.encryption ? this.encryption : false;
    this.backupDurationInReport = this.backupDurationInReport
      ? this.backupDurationInReport
      : false;
  }

  get sendReportToCustomerEmail() {
    return this.mailAddress !== null;
  }

  isInactive() {
    return get(this, 'state', null) === BACKUP_STATE_DISABLED;
  }

  isLegacy() {
    return get(this, 'backupOffer', null) === BACKUP_OFFER_LEGACY;
  }

  isAdvanced() {
    return get(this, 'backupOffer', null) === BACKUP_OFFER_ADVANCED;
  }

  isPremium() {
    return get(this, 'backupOffer', null) === BACKUP_OFFER_PREMIUM;
  }
}
