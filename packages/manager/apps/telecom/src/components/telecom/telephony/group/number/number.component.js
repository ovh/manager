import template from './number.html';
import controller from './number.controller';

export default {
  template,
  controller,
  bindings: {
    number: '=telephonyNumber',
    featureActions: '=telephonyNumberFeatureActions',
  },
};
