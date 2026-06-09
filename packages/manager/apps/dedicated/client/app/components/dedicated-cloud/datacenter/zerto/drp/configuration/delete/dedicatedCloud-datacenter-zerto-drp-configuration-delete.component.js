import controller from './dedicatedCloud-datacenter-zerto-drp-configuration-delete.controller';
import template from './dedicatedCloud-datacenter-zerto-drp-configuration-delete.html';

export default {
  bindings: {
    zertoInformations: '<',
    goBack: '<',
    goBackAfterDelete: '<',
  },
  controller,
  name: 'dedicatedCloudDatacenterZertoDrpConfigurationDelete',
  template,
};
