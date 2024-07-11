import { MANAGED_PCC_MIGRATION_STATUS } from './dedicatedCloud.constant';

export default class PCCMigrationState {
  constructor(value) {
    this.state = value ?? MANAGED_PCC_MIGRATION_STATUS.UNKNOWN;
  }

  get isEnabling() {
    return this.state === MANAGED_PCC_MIGRATION_STATUS.ENABLING;
  }
}
