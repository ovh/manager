import get from 'lodash/get';
import { BACKUP_OFFER_PREMIUM } from './backup.constants';

export default class BackupOffer {
  constructor(offer) {
    Object.assign(this, offer);
  }

  isPremium() {
    return get(this, 'offerName', null) === BACKUP_OFFER_PREMIUM;
  }

  hasCustomReport() {
    return get(this, 'customReport', false);
  }

  hasEncryption() {
    return get(this, 'encryption', false);
  }

  getRetentionCount() {
    return get(this, 'retention', false);
  }

  getMinimumFullBackupsCount() {
    return get(this, 'minimumFullBackups', 0);
  }

  hasReplication() {
    return get(this, 'replication', false);
  }

  hasBackupDays() {
    return get(this, 'backupDays', false);
  }

  hasScheduleHour() {
    return get(this, 'scheduleHour', false);
  }

  hasProxyPerHost() {
    return get(this, 'proxyPerHost', false);
  }

  getPrice() {
    return get(this, 'price', 0);
  }

  getTax() {
    return get(this, 'tax', 0);
  }
}
