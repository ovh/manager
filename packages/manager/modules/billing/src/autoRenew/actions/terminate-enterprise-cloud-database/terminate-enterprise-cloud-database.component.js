import controller from './terminate-enterprise-cloud-database.controller';
import template from './terminate-enterprise-cloud-database.html';

export default {
  bindings: {
    goBack: '<',
    terminateEnterpriseCloudDatabase: '<',
  },
  controller,
  template,
};
