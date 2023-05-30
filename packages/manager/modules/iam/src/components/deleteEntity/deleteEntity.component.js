import controller from './deleteEntity.controller';
import template from './deleteEntity.template.html';

export default {
  bindings: {
    alert: '<',
    entity: '<',
    goBack: '<',
    statement: '<',
  },
  controller,
  template,
  transclude: true,
};
