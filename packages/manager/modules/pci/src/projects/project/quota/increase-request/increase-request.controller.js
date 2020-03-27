import find from 'lodash/find';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import { ISSUE_TYPE_ID } from './increase.constants';

export default class PciProjectQuotaIncreaseController {
  /* @ngInject */
  constructor($translate, OvhApiSupport, PCI_REDIRECT_URLS) {
    this.$translate = $translate;
    this.OvhApiSupport = OvhApiSupport;
    this.PCI_REDIRECT_URLS = PCI_REDIRECT_URLS;
  }

  $onInit() {
    this.isLoading = false;
    this.issueType = find(
      this.issueTypes,
      (issue) => issue.id === ISSUE_TYPE_ID,
    );
    this.issueTypeFieldsStr = get(this.issueType, 'fields', [])
      .map((issueType) => get(issueType, 'label'))
      .join('\n\n');
    this.supportUrl = this.PCI_REDIRECT_URLS[this.region].support;
  }

  increaseQuota() {
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
        issueTypeId: ISSUE_TYPE_ID,
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
}
