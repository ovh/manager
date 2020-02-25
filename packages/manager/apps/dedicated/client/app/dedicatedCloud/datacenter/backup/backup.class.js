import get from 'lodash/get';

import { BACKUP_STATE_DISABLED, BACKUP_OFFER_LEGACY } from './backup.constants';

export default class Backup {
  constructor(backup) {
    Object.assign(this, backup);
  }

  isInactive() {
    return get(this, 'state', null) === BACKUP_STATE_DISABLED;
  }

  isLegacy() {
    return get(this, 'backupOffer', null) === BACKUP_OFFER_LEGACY;
  }
}
