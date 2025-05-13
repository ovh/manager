import controller from './overTheBox-details.controller';
import template from './overTheBox-details.html';

export default {
  controller,
  template,
  bindings: {
    service: '<',
    serviceName: '<',
    changeOffer: '<',
  },
};
