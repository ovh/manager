import find from 'lodash/find';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import { buildURL } from '@ovh-ux/ufrontend/url-builder';

import { ISSUE_TYPE_ID } from './increase.constants';

export default class PciProjectQuotaIncreaseController {
  /* @ngInject */
  constructor($translate, OvhApiSupport) {
    this.$translate = $translate;
    this.OvhApiSupport = OvhApiSupport;
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
    this.supportUrl = buildURL('dedicated', '#/support');
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
