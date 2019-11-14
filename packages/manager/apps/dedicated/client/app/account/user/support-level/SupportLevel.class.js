import {
  AVAILABLE_SUPPORT_LEVEL,
  FULL_SUPPORT_LEVEL_SUBSIDIARIES,
  INACTIVE_SUPPORT_LEVEL,
} from './support-level.constants';

export default class SupportLevel {
  constructor(supportLevel) {
    Object.assign(this, supportLevel);
  }

  isAvailable(subsidiary) {
    return (
      FULL_SUPPORT_LEVEL_SUBSIDIARIES.includes(subsidiary)
      && this.isActive()
    )
      || AVAILABLE_SUPPORT_LEVEL.includes(this.level);
  }

  isActive() {
    return !INACTIVE_SUPPORT_LEVEL.includes(this.level);
  }

  get name() {
    return this.level;
  }
}
