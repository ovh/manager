import find from 'lodash/find';
import get from 'lodash/get';
import slice from 'lodash/slice';

import { FULL_SUPPORT_LEVEL_SUBSIDIARIES, URLS } from './support-level.constants';
import SupportLevel from './SupportLevel.class';

export default class UserAccountSupportLevelCtrl {
  $onInit() {
    this.supportLevelsEnum = get(this.schema.models, 'me.SupportLevel.LevelTypeEnum').enum;
    this.supportLevels = this.supportLevelsEnum.map(level => new SupportLevel({
      level,
      url: get(URLS, `${this.currentUser.ovhSubsidiary.toUpperCase()}.${level}`, `FR.${level}`),
    }));
  }

  getRecommendedLevel() {
    const currentLevelIndex = this.supportLevelsEnum.indexOf(this.supportLevel.level);
    return get(find(slice(this.supportLevels, currentLevelIndex + 1), level => level.isAvailable(this.currentUser.ovhSubsidiary)), 'name');
  }

  areAllLevelsAvailable() {
    return FULL_SUPPORT_LEVEL_SUBSIDIARIES.includes(this.currentUser.ovhSubsidiary);
  }
}
