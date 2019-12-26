import { ENTERPRISE_CLOUD_DATABASE_CLUSTER_NAME_PATTERN } from '../../../enterprise-cloud-database.constants';

export default class {
  /* @ngInject */
  constructor() {
    this.CLUSTER_NAME_PATTERN = ENTERPRISE_CLOUD_DATABASE_CLUSTER_NAME_PATTERN;
  }

  $onInit() {
    this.data = {
      clusterName: this.clusterName,
      clusterPassword: '',
      rule: '',
      securityGroupName: '',
    };
  }

  dataChange(clusterPassword) {
    this.onDataChange({
      data: Object.assign(this.data, {
        clusterPassword: clusterPassword || this.data.clusterPassword,
      }),
    });
  }

  securityGroupDataChanged(data) {
    Object.assign(this.data, data);
    this.dataChange();
  }
}
