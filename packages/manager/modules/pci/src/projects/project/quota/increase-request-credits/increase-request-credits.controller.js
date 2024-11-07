import { TRACK } from '../increase-request/increase.constants';

export default class PciProjectQuotaIncreaseCreditsController {
  /* @ngInject */
  constructor(
    $translate,
    coreURLBuilder,
    pciProjectQuotaIncreaseCredits,
    PciProjectQuota,
    PciProject,
  ) {
    this.$translate = $translate;
    this.coreURLBuilder = coreURLBuilder;
    this.pciProjectQuotaIncreaseCredits = pciProjectQuotaIncreaseCredits;
    this.PciProjectQuota = PciProjectQuota;
    this.PciProject = PciProject;
  }

  $onInit() {
    this.isLoading = false;

    this.billingUrl = this.coreURLBuilder.buildURL(
      'dedicated',
      '#/billing/history',
    );
    this.serviceOptions = this.PciProjectQuota.getServiceOptions().map(
      (serviceOption) => ({
        ...serviceOption,
        formattedName: `${this.$translate.instant(
          `pci_projects_project_quota_increase_select_volume_${serviceOption.planCode}`,
        )} - ${serviceOption.prices[0]?.price.text}`,
      }),
    );
    this.projectDescription = this.PciProject.getProjectInfo().description;
    this.trackQuotaIncreasePopupDisplay();
  }

  isQuotaIncreaseConfirmButtonDisabled() {
    if (this.serviceOptions.length > 0) {
      return !(this.serviceOption && this.serviceOption.planCode);
    }

    return true;
  }

  trackQuotaIncreasePopupDisplay() {
    return this.trackPage(`${TRACK.BASE}::${TRACK.SELECT_PLAN}`);
  }

  trackPopupCancel() {
    return this.trackClick(
      `${TRACK.BASE}::${TRACK.SELECT_PLAN}::${TRACK.CANCEL}`,
    );
  }

  increaseQuota() {
    return this.serviceOptions.length > 0
      ? this.increaseQuotaByCredits()
      : null;
  }

  increaseQuotaByCredits() {
    const planCode =
      (this.serviceOption && this.serviceOption.planCode) || 'quota-no-plan';
    if (!this.serviceOptions) {
      this.trackPage(
        `${TRACK.BASE_SELECT_PLAN_BANNER}::${TRACK.ERROR}::${planCode}`,
      );
      return this.goBack(
        this.$translate.instant(
          'pci_projects_project_quota_increase_error_message',
        ),
        'error',
      );
    }

    this.isLoading = true;
    this.trackClick(
      `${TRACK.BASE}::${TRACK.SELECT_PLAN}::${TRACK.CONFIRM}_${planCode}`,
    );

    return this.pciProjectQuotaIncreaseCredits
      .createCartAndAssign()
      .then(({ cartId }) => {
        return this.pciProjectQuotaIncreaseCredits.orderQuota(
          this.projectId,
          cartId,
          this.serviceOption,
        );
      })
      .then(({ data }) => {
        this.trackPage(
          `${TRACK.BASE_SELECT_PLAN_BANNER}::${TRACK.SUCCESS}::${planCode}`,
        );

        this.goBack(
          this.$translate.instant(
            'pci_projects_project_quota_increase_buy_success_message',
            {
              billingUrl: data.url,
            },
          ),
          'success',
        );
      })
      .catch((err) => {
        this.trackPage(
          `${TRACK.BASE_SELECT_PLAN_BANNER}::${TRACK.ERROR}::${planCode}`,
        );
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_quota_increase_error_message',
            {
              message: err?.data?.message,
            },
          ),
          'error',
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  cancel() {
    this.trackPopupCancel();
    this.goBack();
  }
}
