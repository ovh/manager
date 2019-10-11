import _ from 'lodash';
import { URLS } from './support-level.constants';
import SupportLevel from './SupportLevel.class';

export default class UserAccountSupportLevelCtrl {
  $onInit() {
    this.supportLevelsEnum = _.get(this.schema.models, 'me.SupportLevel.LevelTypeEnum').enum;
    this.supportLevels = this.supportLevelsEnum.map(level => new SupportLevel({
      level,
      url: _.get(URLS, `${this.currentUser.ovhSubsidiary.toUpperCase()}.${level}`, `FR.${level}`),
    }));
  }

  getRecommendedLevel() {
    const currentLevelIndex = this.supportLevelsEnum.indexOf(this.supportLevel.level);
    return _.get(_.find(_.slice(this.supportLevels, currentLevelIndex + 1), level => level.isAvailable()), 'name');
  }
}
