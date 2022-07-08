import template from './rma.html';
import controller from './rma.controller';

export default {
  controller,
  template,
  bindings: {
    billingAccount: '<',
    serviceName: '<',
    reloadPage: '<',
    urlNewTicket: '<',
    rmaTrackClick: '<',
  },
};
