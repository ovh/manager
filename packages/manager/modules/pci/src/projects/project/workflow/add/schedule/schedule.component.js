import controller from './schedule.controller';
import template from './schedule.html';

export default {
  bindings: {
    schedule: '=?',
    isEditMode: '<',
    isCustomizable: '<',
  },
  controller,
  template,
};
