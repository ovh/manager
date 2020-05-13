import {
  BACKUP_STATE_DISABLED,
  BACKUP_STATE_REMOVING,
  BACKUP_STATE_ENABLED,
  BACKUP_OFFER_LEGACY,
  BACKUP_OFFER_ADVANCED,
  BACKUP_OFFER_PREMIUM,
} from './backup.constants';

export default class Backup {
  constructor({
    backupDurationInReport,
    backupOffer,
    backupSizeInReport,
    datacenterId,
    datacenterName,
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
      datacenterId,
      datacenterName,
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
    return this.state === BACKUP_STATE_DISABLED;
  }

  isActive() {
    return this.state === BACKUP_STATE_ENABLED;
  }

  isProcessing() {
    return !(this.isActive() || this.isInactive());
  }

  isRemoving() {
    return this.state === BACKUP_STATE_REMOVING;
  }

  isLegacy() {
    return this.backupOffer === BACKUP_OFFER_LEGACY;
  }

  isAdvanced() {
    return this.backupOffer === BACKUP_OFFER_ADVANCED;
  }

  isPremium() {
    return this.backupOffer === BACKUP_OFFER_PREMIUM;
  }
}
