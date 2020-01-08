import { ENTERPRISE_CLOUD_DATABASE_SECURITY_GROUP_PATTERN } from './security-group-name.constants';

export default class EnterpriseCloudDatabaseServiceSecurityGroupNameCtrl {
  /* @ngInject */
  constructor() {
    this.SECURITY_GROUP_PATTERN = ENTERPRISE_CLOUD_DATABASE_SECURITY_GROUP_PATTERN;
  }

  $onInit() {
    this.data = {
      securityGroupName: this.value || '',
    };
  }
}
