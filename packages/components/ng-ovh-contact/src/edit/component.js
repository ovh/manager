import controller from './controller';
import template from './template.html';

export default {
  require: {
    ovhContactCtrl: '^ovhContact',
  },
  template,
  controller,
  bindings: {
    options: '=?ovhContactChoiceOptions',
    customList: '=?ovhContactChoiceCustomList',
  },
};
