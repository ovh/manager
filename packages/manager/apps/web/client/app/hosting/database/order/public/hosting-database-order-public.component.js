import controller from './hosting-database-order-public.controller';
import template from './hosting-database-order-public.html';

export default {
  name: 'hostingDatabaseOrderPublic',
  controller,
  template,
  bindings: {
    user: '<',
    catalog: '<',
    webCloudCatalog: '<',
    characteristicsOfAvailableProducts: '<',
    goBack: '<',
    hosting: '<',
    serviceName: '<',
    preselectDbCategory: '<',
    dbCategories: '<',

    onError: '<',
    onSuccess: '<',
  },
};
