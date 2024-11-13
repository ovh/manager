import {
  PCC_MIGRATION_STATE,
  PCC_MIGRATION_STATUS,
} from './dedicatedCloud.constant';

export default class PCCMigrationState {
  constructor(value) {
    this.state = PCC_MIGRATION_STATE[Math.min(value ?? 0, 2)];
  }

  get isDone() {
    return this.state === PCC_MIGRATION_STATUS.MIGRATED;
  }

  get isAllowed() {
    return this.state !== PCC_MIGRATION_STATUS.NOT_ALLOWED;
  }
}
