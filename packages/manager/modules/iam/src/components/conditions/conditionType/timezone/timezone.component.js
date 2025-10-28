import template from './timezone.template.html';
import controller from './timezone.controller';

export const name = 'iamConditionTimezone';

export default {
  bindings: {
    timezone: '=ngModel',
    defaultTimezone: '<',
    onChange: '&',
  },
  require: '^ngModel',
  template,
  controller,
};
