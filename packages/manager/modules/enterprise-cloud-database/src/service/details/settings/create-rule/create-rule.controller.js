import get from 'lodash/get';

import { STATUS } from '../../../../enterprise-cloud-database.constants';

export default class EnterpriseCloudDatabaseServiceDetailsSettingsCreateRuleCtrl {
  /* @ngInject */
  constructor(
    $translate,
    enterpriseCloudDatabaseService,
  ) {
    this.$translate = $translate;
    this.enterpriseCloudDatabaseService = enterpriseCloudDatabaseService;
  }

  $onInit() {
    this.loaders = {
      rule: false,
    };
    this.data = {
      rule: '',
    };
  }

  createRule() {
    this.loaders.rule = true;
    this.enterpriseCloudDatabaseService
      .createRule(this.clusterId, this.securityGroup.id, this.data.rule)
      .then(() => {
        this.enterpriseCloudDatabaseService.resetSecurityGroupDetailsCache();
        return this.goBack(
          this.$translate.instant('enterprise_cloud_database_service_details_settings_create_rule_success'),
          STATUS.SUCCESS,
          this.securityGroup.id,
        );
      })
      .catch((error) => this.goBack(
        this.$translate.instant('enterprise_cloud_database_service_details_settings_create_rule_error', {
          message: get(error, 'data.message'),
        }),
        STATUS.ERROR,
      ))
      .finally(() => {
        this.loaders.rule = false;
      });
  }

  ruleChanged(data) {
    Object.assign(this.data, data);
  }
}
