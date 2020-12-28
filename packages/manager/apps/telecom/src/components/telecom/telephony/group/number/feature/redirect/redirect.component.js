import template from './redirect.html';
import controller from './redirect.controller';

export default {
  template,
  controller,
  require: {
    numberCtrl: '^telephonyNumber',
  },
};
