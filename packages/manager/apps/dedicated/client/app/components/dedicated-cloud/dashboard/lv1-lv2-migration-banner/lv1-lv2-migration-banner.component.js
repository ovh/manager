import controller from './lv1-lv2-migration-banner.controller';
import template from './lv1-lv2-migration-banner.html';

export default {
  bindings: {
    productId: '<',
  },
  controller,
  name: 'ovhManagerPccDashboardLv1Lv2MigrationBanner',
  template,
};
