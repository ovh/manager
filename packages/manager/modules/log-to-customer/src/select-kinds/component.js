import template from './template.html';

export default {
  template,
  bindings: {
    kinds: '<',
    ngModel: '=',
    onChange: '&',
  },
  require: '^ngModel',
  name: 'logSelectKinds',
};
