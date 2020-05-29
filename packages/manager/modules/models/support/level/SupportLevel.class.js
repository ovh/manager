import {
  AVAILABLE_SUPPORT_LEVEL,
  FULL_SUPPORT_LEVEL_SUBSIDIARIES,
} from './support-level.constants';

export default class SupportLevel {
  constructor(supportLevel) {
    Object.assign(this, supportLevel);
  }

  isAvailable(subsidiary) {
    return (
      FULL_SUPPORT_LEVEL_SUBSIDIARIES.includes(subsidiary) ||
      AVAILABLE_SUPPORT_LEVEL.includes(this.level)
    );
  }

  isPremium() {
    return this.level === 'premium';
  }

  isAdvancedPremium() {
    return this.level === 'premium-accredited';
  }

  isStandard() {
    return this.level === 'standard';
  }

  get name() {
    return this.level;
  }

  get supportType() {
    const [supportType] = this.level.split('-');
    return supportType;
  }
}
