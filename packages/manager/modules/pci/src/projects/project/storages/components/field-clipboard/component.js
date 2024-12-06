import template from './template.html';
import controller from './controller';

const component = {
  bindings: {
    isDisplayableShowHidePasswordBtn: '<',
    fieldId: '@',
    fieldKeyLabel: '<',
    fieldKeyValue: '<',
    onCopyClick: '&',
  },
  template,
  controller,
};

export default component;
