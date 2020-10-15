import template from './conference.html';
import controller from './conference.controller';

export default {
  template,
  controller,
  require: {
    numberCtrl: '^telephonyNumber',
  },
};
