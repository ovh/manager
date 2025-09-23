import { BillingService } from '@ovh-ux/manager-models';
import { SERVICE_RENEW_MODES } from '../../autorenew.constants';

export default class AutoRenewServiceModalController {
  /* @ngInject */
  constructor(
    ovhUpdateAutoRenewServiceModalService,
    ovhUpdatePeriodTranslationService,
    $translate,
    ovhPaymentMethod,
    $state,
    Alerter,
    $q,
  ) {
    this.ovhUpdateAutoRenewServiceModalService = ovhUpdateAutoRenewServiceModalService;
    this.ovhUpdatePeriodTranslationService = ovhUpdatePeriodTranslationService;
    this.$translate = $translate;
    this.ovhPaymentMethod = ovhPaymentMethod;
    this.$state = $state;
    this.Alerter = Alerter;
    this.$q = $q;
  }

  $onInit() {
    this.billingService = new BillingService(this.service);
    this.hasAgreed = this.autoRenewAgreements?.length === 0;

    this.periods = [];
    this.loading = {
      getRenewPeriods: false,
      updateRenew: false,
    };

    this.ovhPaymentMethod.hasDefaultPaymentMethod().then((payment) => {
      this.hasDefaultPaymentMethod = payment;
    });
    this.getRenewPeriods();
  }

  getRenewPeriods() {
    this.loading.getRenewPeriods = true;
    return this.ovhUpdateAutoRenewServiceModalService
      .getAvailableRenewPeriods(this.billingService)
      .then((periods) => {
        const mappedPeriods = periods.map((period) => ({
          period,
          label: this.ovhUpdatePeriodTranslationService.getTranslationPeriod(
            period,
          ),
        }));

        this.periods = mappedPeriods;
        this.model = {
          period: mappedPeriods.find((p) =>
            this.billingService.renew.automatic
              ? this.billingService.renew.period === p.period
              : SERVICE_RENEW_MODES.MANUAL === p.period,
          ),
        };
      })
      .finally(() => {
        this.loading.getRenewPeriods = false;
      });
  }

  onPeriodChange(value) {
    if (value.period === SERVICE_RENEW_MODES.MANUAL) {
      this.billingService.setManualRenew();
    } else {
      this.billingService.setAutomaticRenew(value.period);
    }
  }

  showAutoRenewalNotice(form) {
    return this.billingService.renew.automatic && !form?.period?.$pristine;
  }

  showManualRenewalNotice(form) {
    return !this.billingService.renew.automatic && !form?.period?.$pristine;
  }

  getNoticeTranslationPeriod() {
    const months = this.billingService.renew.period;

    return this.ovhUpdatePeriodTranslationService.getNoticeTranslationPeriod(
      months,
    );
  }

  showAddPaymentMethodLink(form) {
    return (
      !form?.$pristine &&
      this.billingService.renew.automatic &&
      !this.hasDefaultPaymentMethod
    );
  }

  getAutomaticExpirationDate() {
    return new Intl.DateTimeFormat(this.$translate.use().replace('_', '-'), {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }).format(new Date(this.billingService.expiration));
  }

  submitConfirmation() {
    this.loading.updateRenew = true;
    return this.updateRenew(this.billingService, this.autoRenewAgreements)
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'autorenew_service_update_modal_update_success',
          ),
          'success',
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant(
            'autorenew_service_update_modal_update_error',
            {
              message: error?.data?.message,
            },
          ),
          'danger',
        ),
      )
      .finally(() => {
        this.loading.updateRenew = false;
      });
  }
}
