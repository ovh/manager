import {
  convertPeriodToMonths,
  getBillingRenewUrl,
} from './renew-period.service';

export default class HostingRenewPeriodController {
  /* @ngInject */
  constructor($translate, $window, coreConfig, HostingRenewPeriodService) {
    this.$translate = $translate;
    this.$window = $window;
    this.coreConfig = coreConfig;
    this.HostingRenewPeriodService = HostingRenewPeriodService;
  }

  $onInit() {
    this.isLoading = true;
    this.isSubmitting = false;
    this.loadError = null;

    // Service capabilities & current state
    this.isUpfront = false;
    this.manualModeAvailable = false;
    this.currentPeriod = null;
    this.isCurrentlyManual = false;

    // Available renewal frequencies
    this.availableMonths = [];
    this.optionsByMonths = {};

    this.selectedMonths = undefined;
    this.isManualSelected = false;

    if (!this.serviceId) {
      this.loadError = true;
      this.isLoading = false;
      return;
    }

    this.HostingRenewPeriodService.getServiceDetail(this.serviceId)
      .then((detail) => this.applyServiceDetail(detail))
      .then(() =>
        this.HostingRenewPeriodService.getAvailableEngagements(this.serviceId),
      )
      .then((options) => {
        const opts = options || [];
        this.availableMonths = [...new Set(opts.map((o) => o.months))].sort(
          (a, b) => a - b,
        );
        this.optionsByMonths = {};
        opts.forEach((o) => {
          if (!this.optionsByMonths[o.months]) {
            this.optionsByMonths[o.months] = o;
          }
        });
      })
      .catch(() => {
        this.loadError = true;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  applyServiceDetail(detail) {
    const engagementConfig = detail?.billing?.pricing?.engagementConfiguration;
    this.isUpfront = engagementConfig?.type === 'upfront';

    this.servicePricingMode = detail?.billing?.pricing?.pricingMode;

    const modes = detail?.billing?.renew?.capacities?.mode || [];
    this.manualModeAvailable = modes.includes('manual');

    const currentMode = detail?.billing?.renew?.current?.mode;
    const currentPeriodStr = detail?.billing?.renew?.current?.period;

    this.currentPeriod = currentPeriodStr
      ? convertPeriodToMonths(currentPeriodStr)
      : null;
    this.isCurrentlyManual = currentMode === 'manual' || !currentPeriodStr;
  }

  // ── UI helpers ───────────────────────────────────────────────

  periodLabel(months) {
    if (!months) return '';

    if (months % 12 === 0) {
      const years = months / 12;
      return this.$translate.instant(
        years > 1
          ? 'hosting_renew_period_periodYear_plural'
          : 'hosting_renew_period_periodYear',
        { count: years },
      );
    }
    return this.$translate.instant(
      months > 1
        ? 'hosting_renew_period_periodMonth_plural'
        : 'hosting_renew_period_periodMonth',
      { count: months },
    );
  }

  selectMonths(months) {
    this.selectedMonths = months;
    this.isManualSelected = false;
  }

  selectManual() {
    this.isManualSelected = true;
    this.selectedMonths = undefined;
  }

  isMonthsSelected(months) {
    return !this.isManualSelected && this.selectedMonths === months;
  }

  hasSelection() {
    return this.selectedMonths !== undefined || this.isManualSelected;
  }

  cancel() {
    return this.goBack();
  }

  openBillingRenew() {
    const subsidiary = this.coreConfig.getUser()?.ovhSubsidiary;
    const url = getBillingRenewUrl(subsidiary, this.serviceName);
    if (url) {
      this.$window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  submit() {
    if (!this.hasSelection() || this.isSubmitting) return null;
    this.isSubmitting = true;

    const pricingMode = this.isManualSelected
      ? this.servicePricingMode
      : this.optionsByMonths[this.selectedMonths]?.pricingMode;

    const submitPromise = this.HostingRenewPeriodService.submitEngagementRequest(
      this.serviceId,
      pricingMode,
    ).then((response) => {
      if (response && response.status === 200) {
        this.openBillingRenew();
      }
      return response;
    });

    return submitPromise
      .then(() =>
        this.goBack(
          this.$translate.instant('hosting_renew_period_successToast'),
          'success',
          true,
        ),
      )
      .catch(({ data } = {}) =>
        this.goBack(
          this.$translate.instant('hosting_renew_period_errorToast', {
            error: data?.message || '',
          }),
          'danger',
        ),
      );
  }
}
