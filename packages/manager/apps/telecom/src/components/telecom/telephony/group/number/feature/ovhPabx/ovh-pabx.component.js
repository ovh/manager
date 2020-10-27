import template from './ovh-pabx.html';
import controller from './ovh-pabx.controller';

export default {
  template,
  controller,
  require: {
    numberCtrl: '^^telephonyNumber',
  },
};
