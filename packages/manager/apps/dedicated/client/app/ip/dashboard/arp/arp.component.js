import controller from './arp.controller';
import template from './arp.html';

export default {
  bindings: {
    goBack: '<',
    ip: '<',
    ipBlock: '<',
  },
  controller,
  template,
};
