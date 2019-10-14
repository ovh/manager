import {
  ENTERPRISE_CLOUD_DATABASE_RULE_PATTERN,
} from './rule.constants';

export default class EnterpriseCloudDatabasePasswordCtrl {
  /* @ngInject */
  constructor() {
    this.RULE_PATTERN = ENTERPRISE_CLOUD_DATABASE_RULE_PATTERN;
  }

  $onInit() {
    this.data = {
      rule: '',
    };
  }
}
