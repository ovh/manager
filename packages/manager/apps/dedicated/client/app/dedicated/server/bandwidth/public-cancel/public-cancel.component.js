import controller from './public-cancel.controller';
import template from './public-cancel.html';

export default {
  controller,
  template,
  bindings: {
    cancelBandwidthOption: '<',
    goBack: '<',
    serverName: '<',
  },
};
