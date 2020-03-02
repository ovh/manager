import get from 'lodash/get';

import {
  BACKUP_STATE_DISABLED,
  BACKUP_OFFER_LEGACY,
  BACKUP_OFFER_ADVANCED,
  BACKUP_OFFER_PREMIUM,
} from './backup.constants';

export default class Backup {
  constructor({
    backupDurationInReport,
    backupOffer,
    backupSizeInReport,
    diskSizeInReport,
    encryption,
    fullDayInReport,
    hostname,
    mailAddress,
    replicationZone,
    restorePointInReport,
    scheduleHour,
    state,
    vmwareVmId,
  }) {
    Object.assign(this, {
      backupDurationInReport,
      backupOffer,
      backupSizeInReport,
      diskSizeInReport,
      encryption,
      fullDayInReport,
      hostname,
      mailAddress,
      replicationZone,
      restorePointInReport,
      scheduleHour,
      state,
      vmwareVmId,
    });

    this.backupSizeInReport = backupSizeInReport || false;
    this.fullDayInReport = fullDayInReport || false;
    this.restorePointInReport = restorePointInReport || false;
    this.diskSizeInReport = diskSizeInReport || false;
    this.encryption = encryption || false;
    this.backupDurationInReport = backupDurationInReport || false;
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
