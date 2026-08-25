import {
  CLOUD_WEB_MIGRATION_APPROVAL_CODE,
  CLOUD_WEB_MIGRATION_RESOURCE_TYPE,
  CUSTOMER_APPROVAL_URL,
} from './cloud-web-migration.constants';

export default class HostingCloudWebMigrationService {
  /* @ngInject */
  constructor(Apiv2Service) {
    this.Apiv2Service = Apiv2Service;
  }

  /**
   * Record the customer decision on the Cloud Web migration.
   * Reading it back lives on the always-loaded `Hosting` service, because the
   * dashboard needs it before this lazy module is injected.
   * @param {string} serviceName
   * @param {boolean} approved
   */
  submitApproval(serviceName, approved) {
    return this.Apiv2Service.httpApiv2({
      method: 'post',
      url: CUSTOMER_APPROVAL_URL,
      data: {
        approvalCode: CLOUD_WEB_MIGRATION_APPROVAL_CODE,
        approved,
        resourceId: serviceName,
        resourceType: CLOUD_WEB_MIGRATION_RESOURCE_TYPE,
      },
    }).then(({ data }) => data);
  }
}
