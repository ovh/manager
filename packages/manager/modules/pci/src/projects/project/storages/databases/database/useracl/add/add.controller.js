import remove from 'lodash/remove';
import { ADD_USER_FORM_RULES } from './add.constants';

export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.DatabaseService = DatabaseService;
    this.inputRules = ADD_USER_FORM_RULES;
  }

  $onInit() {
    this.trackDashboard('users::add_a_user', 'page');
    this.rules = [];
  }

  cancel() {
    this.trackDashboard('users::add_a_user::cancel');
    this.goBack();
  }

  onAdd(form) {
    this.rules.push({
      permission: form.permission.$modelValue,
      pattern: form.pattern.$modelValue,
    });
  }

  onRemove(form) {
    remove(
      this.rules,
      (r) =>
        r.permission === form.permission.$modelValue &&
        r.pattern === form.pattern.$modelValue,
    );
  }
}
