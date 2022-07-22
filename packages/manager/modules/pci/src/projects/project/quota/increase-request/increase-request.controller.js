import find from 'lodash/find';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import { ISSUE_TYPE_IDS, QUOTA_INCREASE_MODES } from './increase.constants';

export default class PciProjectQuotaIncreaseController {
  /* @ngInject */
  constructor(
    $translate,
    atInternet,
    coreURLBuilder,
    pciProjectQuotaIncrease,
    OvhApiSupport,
    PciProjectQuota,
    PciProject,
  ) {
    this.$translate = $translate;
    this.atInternet = atInternet;
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

  trackQuotaIncreasePopupDisplay() {
    if (this.mode === QUOTA_INCREASE_MODES.BUY_CREDITS) {
      return this.trackQuotaPageElementDisplay(
        'PublicCloud::pci::projects::project::quota::increase',
      );
    }
    return this.trackQuotaPageElementDisplay(
      'PublicCloud::pci::projects::project::quota::increase-contact',
    );
  }

  trackPopupCancel() {
    if (this.mode === QUOTA_INCREASE_MODES.BUY_CREDITS) {
      this.trackQuotaIncreaseClick(
        'PublicCloud::pci::projects::project::quota::increase::cancel',
      );
    } else {
      this.trackQuotaIncreaseClick(
        'PublicCloud::pci::projects::project::quota::increase-contact::cancel',
      );
    }
  }

  trackQuotaPageElementDisplay(eventLabel) {
    this.atInternet.trackPage({
      name: eventLabel,
      type: 'action',
    });
  }

  trackQuotaIncreaseClick(eventLabel) {
    this.atInternet.trackClick({
      name: eventLabel,
      type: 'action',
    });
  }

  increaseQuota() {
    if (this.mode === QUOTA_INCREASE_MODES.BUY_CREDITS) {
      return this.increaseQuotaByCredits();
    }
    return this.increaseQuotaBySupport();
  }

  increaseQuotaBySupport() {
    if (isNil(this.issueType)) {
      this.trackQuotaPageElementDisplay(
        'PublicCloud::quota-contact-banner::error',
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
    this.trackQuotaIncreaseClick(
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
        this.trackQuotaPageElementDisplay(
          'PublicCloud::quota-contact-banner::success',
        );
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
        this.trackQuotaPageElementDisplay(
          'PublicCloud::quota-contact-banner::error',
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

  increaseQuotaByCredits() {
    const planCode =
      (this.serviceOption && this.serviceOption.planCode) || 'quota-no-plan';
    if (isNil(this.serviceOptions)) {
      this.trackQuotaPageElementDisplay(
        `PublicCloud::quota-increase-banner::error::${planCode}`,
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
    this.trackQuotaIncreaseClick(
      `PublicCloud::pci::projects::project::quota::increase::confirm_${planCode}`,
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
        this.trackQuotaIncreaseClick(
          `PublicCloud::quota-increase-banner::success::${planCode}`,
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
        this.trackQuotaIncreaseClick(
          `PublicCloud::quota-increase-banner::error::${planCode}`,
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
