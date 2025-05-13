export default class PartnerLevel {
  /**
   * @param {PartnerLevel} Object payload representing the level of partnership
   * @param {PartnerLevel.level} Enum partnership level
   * @param {PartnerLevel.requirement} Enum support level required
   */
  constructor({ level, requirement }) {
    Object.assign(this, {
      level: level === 'none' ? null : level,
      requiredSupportLevel: requirement === 'none' ? null : requirement,
    });
  }

  isAdvanced() {
    return this.level === 'advanced';
  }

  isActive() {
    return !!this.level;
  }
}
