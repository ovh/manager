import controller from './hosting-database-order-public.controller';
import template from './hosting-database-order-public.html';

export default {
  name: 'hostingDatabaseOrderPublic',
  controller,
  template,
  bindings: {
    catalog: '<',
    characteristicsOfAvailableProducts: '<',
    goBack: '<',
    hosting: '<',
    serviceName: '<',
    user: '<',

    onError: '<',
    onSuccess: '<',
  },
};
