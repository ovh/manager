import find from 'lodash/find';
import get from 'lodash/get';
import slice from 'lodash/slice';
import some from 'lodash/some';

import { SupportLevel } from '@ovh-ux/manager-models';
import { URLS } from './support-level.constants';

export default class UserAccountSupportLevelCtrl {
  $onInit() {
    this.supportLevelsEnum = get(
      this.schema.models,
      'me.SupportLevel.LevelTypeEnum',
    ).enum;
    this.supportLevels = this.supportLevelsEnum.map(
      (level) =>
        new SupportLevel({
          level,
          url: get(
            URLS,
            `${this.currentUser.ovhSubsidiary.toUpperCase()}.${level}`,
            get(URLS, `FR.${level}`),
          ),
        }),
    );
  }

  getRecommendedLevel() {
    const currentLevelIndex = this.supportLevelsEnum.indexOf(
      this.supportLevel.level,
    );
    return get(
      find(slice(this.supportLevels, currentLevelIndex + 1), (level) =>
        level.isAvailable(this.currentUser.ovhSubsidiary),
      ),
      'name',
    );
  }

  areAllLevelsAvailable() {
    return some(
      this.supportLevels,
      (level) => !level.isAvailable(this.currentUser.ovhSubsidiary),
    );
  }
}
