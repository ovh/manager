import controller from './calendar-edit.controller';
import template from './calendar-edit.html';

export default {
  bindings: {
    model: '=',
    initValue: '<',
    disabled: '<',
    readonly: '<',
    callback: '&',
    callbackSuccess: '&',
    callbackError: '&',
  },
  controller,
  template,
};
