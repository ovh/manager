import { SERVICE_RENEW_MODES } from './update.constants';

export default class UpdatePeriodTranslationService {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

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

  getTranslationPeriod(months) {
    return this.translatePeriod(
      months,
      {
        manual: 'autorenew_service_update_modal_period_manual',
        everyMonth: 'autorenew_service_update_modal_period_every_month',
        everyYear: 'autorenew_service_update_modal_period_every_year',
        everyXYears: 'autorenew_service_update_modal_period_every_x_years',
        everyXMonths: 'autorenew_service_update_modal_period_every_x_months',
      },
      true,
    );
  }

  getNoticeTranslationPeriod(months) {
    return this.translatePeriod(months, {
      everyMonth:
        'autorenew_service_update_modal_automatic_every_month_renewal_notice',
      everyYear:
        'autorenew_service_update_modal_automatic_every_year_renewal_notice',
      everyXYears:
        'autorenew_service_update_modal_automatic_every_x_year_renewal_notice',
      everyXMonths:
        'autorenew_service_update_modal_automatic_every_x_month_renewal_notice',
    });
  }
}
