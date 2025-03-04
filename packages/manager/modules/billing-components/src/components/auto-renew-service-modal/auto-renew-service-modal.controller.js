import { SERVICE_RENEW_MODES } from './auto-renew-service-modal.constants';

export default class AutoRenewServiceModalController {
  /* @ngInject */
  constructor(
    ovhAutoRenewServiceModalService,
    $translate,
    ovhPaymentMethod,
    $state,
    Alerter,
    $q,
  ) {
    this.ovhAutoRenewServiceModalService = ovhAutoRenewServiceModalService;
    this.$translate = $translate;
    this.ovhPaymentMethod = ovhPaymentMethod;
    this.$state = $state;
    this.Alerter = Alerter;
    this.$q = $q;
  }

  $onInit() {
    this.serviceToUpdate = Object.assign(
      Object.create(Object.getPrototypeOf(this.service)),
      JSON.parse(JSON.stringify(this.service)),
    );
    this.autorenewAgreements = [];
    this.periods = [];
    this.loading = {
      getRenewPeriods: false,
      getAgreements: false,
      updateRenew: false,
    };

    this.ovhPaymentMethod.hasDefaultPaymentMethod().then((payment) => {
      this.hasDefaultPaymentMethod = payment;
    });
    this.getRenewPeriods();
    this.getAgreements();
  }

  getRenewPeriods() {
    this.loading.getRenewPeriods = true;
    return this.ovhAutoRenewServiceModalService
      .getAvailableRenewPeriods(this.service)
      .then((periods) => {
        this.periods = periods;
        this.model = {
          period: this.service.renew.automatic
            ? periods.find((p) => this.service.renew.period === p.period)
            : periods.find((p) => SERVICE_RENEW_MODES.MANUAL === p.period),
        };
      })
      .finally(() => {
        this.loading.getRenewPeriods = false;
      });
  }

  getAgreements() {
    this.loading.getAgreements = true;
    return this.ovhAutoRenewServiceModalService
      .getAutorenewAgreements()
      .then((agreements) => {
        this.autorenewAgreements = agreements;
        this.hasAgreed = agreements.length === 0;
      })
      .finally(() => {
        this.loading.getAgreements = false;
      });
  }

  onPeriodChange(value) {
    if (value.period === SERVICE_RENEW_MODES.MANUAL) {
      this.serviceToUpdate.setManualRenew();
    } else {
      this.serviceToUpdate.setAutomaticRenew(value.period);
    }
  }

  showAutoRenewalNotice(form) {
    return this.serviceToUpdate.renew.automatic && !form?.period?.$pristine;
  }

  showManualRenewalNotice(form) {
    return !this.serviceToUpdate.renew.automatic && !form?.period?.$pristine;
  }

  showAddPaymentMethodLink(form) {
    return (
      !form?.$pristine &&
      this.serviceToUpdate.renew.automatic &&
      !this.hasDefaultPaymentMethod
    );
  }

  getAutomaticExpirationDate() {
    return new Intl.DateTimeFormat(this.$translate.use().replace('_', '-'), {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }).format(new Date(this.service.expiration));
  }

  submitConfirmation() {
    this.loading.updateRenew = true;

    return this.ovhAutoRenewServiceModalService
      .updateRenew(this.serviceToUpdate, this.autorenewAgreements)
      .then(() => {
        if (this.model.period.period === SERVICE_RENEW_MODES.MANUAL) {
          this.service.setManualRenew();
        } else {
          this.service.setAutomaticRenew(this.model.period.period);
        }
        this.Alerter.success(
          this.$translate.instant(
            'autorenew_service_update_modal_update_success',
          ),
        );
        return this.$q.resolve();
      })
      .catch((error) => {
        const errorMessages = error.messages
          .map((err) => err.message)
          .join(', ');
        this.Alerter.set(
          'alert-danger',
          this.$translate.instant(
            'autorenew_service_update_modal_update_error',
            {
              message: errorMessages,
            },
          ),
        );
        return this.$q.resolve();
      })
      .finally(() => {
        this.loading.updateRenew = false;
        this.onClose();
        return this.$q.resolve();
      });
  }

  addPaymentMethod() {
    this.$state.go('billing.payment.method.add');
  }
}
