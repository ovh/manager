import controller from './telephony-group-number.component.controller';
import template from './telephony-group-number.html';

export default {
  template,
  bindings: {
    number: '=telephonyNumber',
    featureActions: '=telephonyNumberFeatureActions',
  },
  controller,
};
