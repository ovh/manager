import controller from './selectModal.controller';
import template from './selectModal.template.html';
import './selectModal.styles.scss';

export default {
  bindings: {
    currentIdentities: '<',
    close: '<',
    getOptions: '<',
    onAddOptions: '<',
    searchFilter: '<',
    heading: '@',
    emptyStateMessage: '@',
    searchPlaceholder: '@',
  },
  controller,
  template,
  transclude: {
    checkboxValue: '?iamCheckboxValue',
    checkboxDescription: '?iamCheckboxDescription',
  },
};
