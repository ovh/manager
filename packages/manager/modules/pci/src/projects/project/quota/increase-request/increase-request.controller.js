import find from 'lodash/find';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import { ISSUE_TYPE_IDS } from './increase.constants';

export default class PciProjectQuotaIncreaseController {
  /* @ngInject */
  constructor(
    $translate,
    atInternet,
    coreURLBuilder,
    pciProjectQuotaIncrease,
    OvhApiSupport,
  ) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.coreURLBuilder = coreURLBuilder;
    this.pciProjectQuotaIncrease = pciProjectQuotaIncrease;
    this.OvhApiSupport = OvhApiSupport;
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
    this.serviceOptions = this.serviceOptions.map((serviceOption) => ({
      ...serviceOption,
      formattedName: `${this.$translate.instant(
        `pci_projects_project_quota_increase_select_volume_${serviceOption.planCode}`,
      )} - ${serviceOption.prices[0].price.text}`,
    }));
  }

  increaseQuota() {
    if (this.serviceOptions.length > 0) {
      return this.increaseQuotaByCredits();
    }

    return this.increaseQuotaBySupport();
  }

  increaseQuotaBySupport() {
    if (isNil(this.issueType)) {
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
      .$promise.then(
        ({ ticketId }) =>
          this.goBack(
            this.$translate.instant(
              'pci_projects_project_quota_increase_success_message',
              {
                ticketUrl: `${this.supportUrl}/tickets/${ticketId}`,
              },
            ),
          ),
        'success',
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_quota_increase_error_message',
            {
              message: get(err, 'data.message', null),
            },
          ),
          'error',
        ),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }

  increaseQuotaByCredits() {
    if (isNil(this.serviceOptions)) {
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
        this.atInternet.trackClick({
          name: `PublicCloud::pci::projects::project::quota::increase::confirm_${this.serviceOption.planCode}`,
          type: 'action',
        });
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
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_quota_increase_error_message',
            {
              message: get(err, 'data.message', null),
            },
          ),
          'error',
        ),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }

  cancel() {
    this.atInternet.trackClick({
      name: 'PublicCloud::pci::projects::project::quota::increase::cancel',
      type: 'action',
    });
    this.goBack();
  }
}
