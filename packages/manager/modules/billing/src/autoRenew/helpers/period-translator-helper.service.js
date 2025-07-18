import { SERVICE_RENEW_MODES } from '../autorenew.constants';

export default class PeriodTranslatorHelperService {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  /**
   * Returns the translation for a period given in months
   * @param {number} months number
   * @param {Object} keys mapping of i18n keys
   * @param {boolean} includeManual whether to handle manual mode
   */
  translatePeriod(months, keys, includeManual = false) {
    if (includeManual && months === SERVICE_RENEW_MODES.MANUAL) {
      return this.$translate.instant(keys.manual);
    }
    if (months === 1) {
      return this.$translate.instant(keys.everyMonth);
    }
    if (months === 12) {
      return this.$translate.instant(keys.everyYear);
    }
    if (months % 12 === 0) {
      const years = months / 12;
      return this.$translate.instant(keys.everyXYears, { years });
    }
    return this.$translate.instant(keys.everyXMonths, { months });
  }
}
