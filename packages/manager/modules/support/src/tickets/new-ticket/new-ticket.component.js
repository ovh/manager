import controller from './new-ticket.controller';
import template from './new-ticket.html';

export default {
  bindings: {
    goToTickets: '&',
    categoryName: '<?',
    serviceName: '<?',
    serviceTypeName: '<?',
    preFetchData: '<?',
    urls: '<',
  },
  controller,
  name: 'supportNew',
  template,
};
