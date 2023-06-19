import controller from './hosting-database-order-public.controller';
import template from './hosting-database-order-public.html';

export default {
  name: 'hostingDatabaseOrderPublic',
  controller,
  template,
  bindings: {
    serviceName: '<',
    hosting: '<',
    user: '<',
    cart: '<',
    catalog: '<',
    preProdCatalog: '<',
    webCloudCatalog: '<',
    preselectDbCategory: '<',
    dbCategories: '<',

    onError: '<',
    onSuccess: '<',

    goBack: '<',
  },
};
