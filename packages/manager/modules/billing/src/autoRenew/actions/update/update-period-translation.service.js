export default class UpdatePeriodTranslationService {
  /* @ngInject */
  constructor(billingPeriodTranslatorHelper) {
    this.billingPeriodTranslatorHelper = billingPeriodTranslatorHelper;
  }

  getTranslationPeriod(months) {
    return this.billingPeriodTranslatorHelper.translatePeriod(
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
    return this.billingPeriodTranslatorHelper.translatePeriod(months, {
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
