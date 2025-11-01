import controller from './customer-vcfaas-migration-banner.controller';
import template from './customer-vcfaas-migration-banner.html';

export default {
  bindings: {
    serviceName: '<',
    setMessage: '<',
  },
  controller,
  name: 'ovhManagerPccDashboardCustomerVcfaasMigrationBanner',
  template,
};
