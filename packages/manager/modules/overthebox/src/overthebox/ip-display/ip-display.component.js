import controller from './ip-display.controller';
import template from './ip-display.html';

import './ip-display.scss';

export default {
  controller,
  template,
  bindings: {
    ip: '<',
    isUpdating: '<',
    isIpv6Enabled: '=',
    onIpActivationUpdate: '&',
  },
};
