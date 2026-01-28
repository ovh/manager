import { AbstractCursorDatagridController } from '@ovh-ux/manager-ng-apiv2-helper';

export default class LogsIAMPoliciesController extends AbstractCursorDatagridController {
  /* @ngInject */
  constructor(coreURLBuilder, logsIAMPoliciesService) {
    super();
    this.coreURLBuilder = coreURLBuilder;
    this.logsIAMPoliciesService = logsIAMPoliciesService;
    this.pageSize = 10;
  }

  $onInit() {
    this.iamPoliciesUrl = this.coreURLBuilder.buildURL(
      'iam',
      '#/policies/myPolicies',
    );
  }

  getIAMPolicyUrl(policy) {
    return `${this.iamPoliciesUrl}/${policy}`;
  }

  createItemsPromise({ cursor }) {
    const {
      serviceName,
      iam: { urn },
    } = this.service;
    return this.logsIAMPoliciesService.fetch({
      cursor,
      serviceName,
      urn,
    });
  }
}
