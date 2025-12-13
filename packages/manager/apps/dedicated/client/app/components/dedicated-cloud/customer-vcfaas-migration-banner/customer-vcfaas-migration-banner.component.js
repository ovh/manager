import controller from './customer-vcfaas-migration-banner.controller';
import template from './customer-vcfaas-migration-banner.html';

export default {
  bindings: {
    serviceName: '<',
    setMessage: '<',
    vcdMigrationState: '<',
  },
  controller,
  name: 'ovhManagerPccDashboardCustomerVcfaasMigrationBanner',
  template,
};
