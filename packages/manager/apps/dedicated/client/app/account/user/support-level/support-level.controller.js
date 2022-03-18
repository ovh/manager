import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import get from 'lodash/get';
import slice from 'lodash/slice';
import some from 'lodash/some';

import { SupportLevel, PartnerLevel } from '@ovh-ux/manager-models';
import { SUBSCRIPTION, URLS } from './support-level.constants';

export default class UserAccountSupportLevelCtrl {
  /* @ngInject */
  constructor(constants) {
    this.constants = constants;
  }

  $onInit() {
    this.orderBaseUrl = get(
      this.constants,
      `urls.${this.currentUser.ovhSubsidiary}.express_order`,
      this.constants.urls.FR.express_order,
    );
    this.supportLevelsEnum = [
      'standard',
      'premium',
      'premium-accredited',
      'business',
      'enterprise',
    ];
    this.supportLevels = this.supportLevelsEnum
      .map(
        (level) =>
          new SupportLevel({
            level,
            url: get(
              URLS,
              `${this.currentUser.ovhSubsidiary.toUpperCase()}.${level}`,
              get(URLS, `FR.${level}`),
            ),
            subscriptionUrl: this.getSubscriptionUrl(level),
          }),
      )
      .filter((level) => this.isLevelActive(level))
      .filter(({ name }) =>
        this.supportAvailability.isFeatureAvailable(`support:${name}`),
      );
  }

  getSubscriptionUrl(supportLevel) {
    return `${this.orderBaseUrl}review?products=${JSURL.stringify(
      SUBSCRIPTION(supportLevel.replace('-', '_')),
    )}`;
  }

  getRecommendedLevel() {
    const currentLevelIndex = findIndex(this.supportLevels, {
      name: this.supportLevel.level,
    });

    return get(
      find(slice(this.supportLevels, currentLevelIndex + 1), (level) =>
        level.isAvailable(this.currentUser.ovhSubsidiary),
      ),
      'name',
    );
  }

  areAllLevelsAvailable() {
    return !some(
      this.supportLevels,
      (level) => !level.isAvailable(this.currentUser.ovhSubsidiary),
    );
  }

  isLevelActive(supportLevel) {
    if (
      this.partnerLevel.isAdvanced() ||
      this.supportLevel.isAdvancedPremium()
    ) {
      return this.supportLevel.isPremium()
        ? !supportLevel.isStandard()
        : !supportLevel.isPremium();
    }

    return !supportLevel.isAdvancedPremium();
  }

  shouldSubscribe(supportLevel) {
    return supportLevel.name === this.partnerLevel.requiredSupportLevel;
  }

  change(prop, key, value) {
    this[prop][key] = value;
    this.supportLevel = new SupportLevel({ level: this.supportLevel.level });
    this.partnerLevel = new PartnerLevel({
      level: this.partnerLevel.level,
      requirement: this.partnerLevel.requiredSupportLevel,
    });
    this.$onInit();
    return true;
  }
}
