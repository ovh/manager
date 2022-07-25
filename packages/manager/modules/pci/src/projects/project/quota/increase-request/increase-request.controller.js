import find from 'lodash/find';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import { ISSUE_TYPE_IDS, QUOTA_INCREASE_MODES } from './increase.constants';

export default class PciProjectQuotaIncreaseController {
  /* @ngInject */
  constructor(
    $translate,
    coreURLBuilder,
    pciProjectQuotaIncrease,
    OvhApiSupport,
    PciProjectQuota,
    PciProject,
  ) {
    this.$translate = $translate;
    this.coreURLBuilder = coreURLBuilder;
    this.pciProjectQuotaIncrease = pciProjectQuotaIncrease;
    this.OvhApiSupport = OvhApiSupport;
    this.PciProjectQuota = PciProjectQuota;
    this.PciProject = PciProject;
  }

  $onInit() {
    this.isLoading = false;
    this.issueType = find(this.issueTypes, ({ id }) =>
      ISSUE_TYPE_IDS.includes(id),
    );
    this.issueTypeFieldsStr = get(this.issueType, 'fields', [])
      .map((issueType) => get(issueType, 'label'))
      .join('\n\n');
    this.supportUrl = this.coreURLBuilder.buildURL('dedicated', '#/support');
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
    this.QUOTA_INCREASE_MODES = QUOTA_INCREASE_MODES;
    this.projectDescription = this.PciProject.getProjectInfo().description;
    this.trackQuotaIncreasePopupDisplay();
  }

  isQuotaIncreaseConfirmButtonDisabled() {
    if (
      this.mode === QUOTA_INCREASE_MODES.BUY_CREDITS &&
      this.serviceOptions.length > 0
    ) {
      return !(this.serviceOption && this.serviceOption.planCode);
    }

    if (this.mode === QUOTA_INCREASE_MODES.CONTACT_SUPPORT) {
      return !this.issueTypeDescription;
    }
    return true;
  }

  trackQuotaIncreasePopupDisplay() {
    if (this.mode === QUOTA_INCREASE_MODES.BUY_CREDITS) {
      return this.trackPage(
        'PublicCloud::pci::projects::project::quota::select-plan',
      );
    }
    if (this.mode === QUOTA_INCREASE_MODES.CONTACT_SUPPORT) {
      return this.trackPage(
        'PublicCloud::pci::projects::project::quota::increase-contact',
      );
    }
    return null;
  }

  trackPopupCancel() {
    if (
      this.mode === QUOTA_INCREASE_MODES.BUY_CREDITS &&
      this.serviceOptions.length > 0
    ) {
      return this.trackClick(
        'PublicCloud::pci::projects::project::quota::select-plan::cancel',
      );
    }
    if (this.mode === QUOTA_INCREASE_MODES.CONTACT_SUPPORT) {
      return this.trackClick(
        'PublicCloud::pci::projects::project::quota::increase-contact::cancel',
      );
    }
    return null;
  }

  increaseQuota() {
    if (
      this.mode === QUOTA_INCREASE_MODES.BUY_CREDITS &&
      this.serviceOptions.length > 0
    ) {
      return this.increaseQuotaByCredits();
    }
    if (this.mode === QUOTA_INCREASE_MODES.CONTACT_SUPPORT) {
      return this.increaseQuotaBySupport();
    }
    return null;
  }

  increaseQuotaBySupport() {
    if (isNil(this.issueType)) {
      this.trackPage('PublicCloud::quota-contact-banner::error');
      return this.goBack(
        this.$translate.instant(
          'pci_projects_project_quota_increase_error_message',
          {
            message: '',
          },
        ),
        'error',
      );
    }

    this.isLoading = true;
    this.trackClick(
      'PublicCloud::pci::projects::project::quota::increase-contact::confirm',
    );

    return this.OvhApiSupport.v6()
      .createTickets({
        issueTypeId: this.issueType.id,
        serviceName: this.projectId,
        subject: get(this.issueType, 'label'),
        body: `
${get(this.issueType, 'subject')}

${this.issueTypeFieldsStr}

${this.issueTypeDescription}
        `,
      })
      .$promise.then(({ ticketId }) => {
        this.trackPage('PublicCloud::quota-contact-banner::success');
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_quota_increase_success_message',
            {
              ticketUrl: `${this.supportUrl}/tickets/${ticketId}`,
            },
          ),
        );
      }, 'success')
      .catch((err) => {
        this.trackPage('PublicCloud::quota-contact-banner::error');
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_quota_increase_error_message',
            {
              message: get(err, 'data.message', null),
            },
          ),
          'error',
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  increaseQuotaByCredits() {
    const planCode =
      (this.serviceOption && this.serviceOption.planCode) || 'quota-no-plan';
    if (isNil(this.serviceOptions)) {
      this.trackPage(
        `PublicCloud::quota-select-plan-banner::error::${planCode}`,
      );
      return this.goBack(
        this.$translate.instant(
          'pci_projects_project_quota_increase_error_message',
          {
            message: '',
          },
        ),
        'error',
      );
    }

    this.isLoading = true;
    this.trackClick(
      `PublicCloud::pci::projects::project::quota::select-plan::confirm_${planCode}`,
    );

    return this.pciProjectQuotaIncrease
      .createCartAndAssign()
      .then(({ cartId }) => {
        return this.pciProjectQuotaIncrease.orderQuota(
          this.projectId,
          cartId,
          this.serviceOption,
        );
      })
      .then(({ data }) => {
        this.trackPage(
          `PublicCloud::quota-select-plan-banner::success::${planCode}`,
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
          `PublicCloud::quota-select-plan-banner::error::${planCode}`,
        );
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_quota_increase_error_message',
            {
              message: get(err, 'data.message', null),
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
