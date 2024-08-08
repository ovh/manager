import {
  MANAGED_VCD_MIGRATION_STATE,
  MANAGED_VCD_MIGRATION_STATUS,
} from './dedicatedCloud.constant';

export default class VCDMigrationState {
  constructor(value) {
    this.state = MANAGED_VCD_MIGRATION_STATE[Math.min(value ?? 0, 2)];
  }

  get isDone() {
    return this.state === MANAGED_VCD_MIGRATION_STATUS.MIGRATED;
  }

  get isAllowed() {
    return this.state !== MANAGED_VCD_MIGRATION_STATUS.NOT_ALLOWED;
  }
}
