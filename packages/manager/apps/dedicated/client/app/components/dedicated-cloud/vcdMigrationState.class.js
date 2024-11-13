import { VCD_MIGRATION_STATUS } from './dedicatedCloud.constant';

export default class VCDMigrationState {
  constructor({ state, value }) {
    this.state = state ?? VCD_MIGRATION_STATUS.UNKNOWN;
    this.value = value;
  }

  get isEnabling() {
    return this.state === VCD_MIGRATION_STATUS.ENABLING;
  }

  get isEnabled() {
    return this.state === VCD_MIGRATION_STATUS.ENABLED;
  }

  get vcdName() {
    return this.value;
  }
}
