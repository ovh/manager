import controller from './controller';
import template from './template.html';

export default {
  transclude: true,
  require: {
    ovhContactCtrl: '^ovhContact',
  },
  template,
  controller,
  bindings: {
    filter: '&?ovhContactChoiceFilter',
    customList: '=?ovhContactChoiceCustomList',
    options: '=?ovhContactChoiceOptions',
  },
};
