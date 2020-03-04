import get from 'lodash/get';
import { BACKUP_OFFER_PREMIUM } from './backup.constants';

export default class BackupOffer {
  constructor({
    backupDays,
    customReport,
    dedicatedProxy,
    encryption,
    mailAddress,
    minimumFullBackups,
    offerName,
    price,
    proxyPerHost,
    replication,
    retention,
    scheduleHour,
    tax,
  }) {
    Object.assign(this, {
      backupDays,
      customReport,
      dedicatedProxy,
      encryption,
      mailAddress,
      minimumFullBackups,
      offerName,
      price,
      proxyPerHost,
      replication,
      retention,
      scheduleHour,
      tax,
    });
  }

  isPremium() {
    return get(this, 'offerName', null) === BACKUP_OFFER_PREMIUM;
  }
}
