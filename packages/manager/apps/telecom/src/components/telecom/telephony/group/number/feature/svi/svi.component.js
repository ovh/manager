import template from './svi.html';
import controller from './svi.controller';

export default {
  template,
  controller,
  require: {
    numberCtrl: '^telephonyNumber',
  },
};
