import template from './template.html';
import controller from './controller';

const component = {
  bindings: {
    isDisplayableShowHidePasswordBtn: '<',
    fieldData: '<',
    fieldKeyLabel: '<',
    fieldKeyValue: '<',
    onCopyClick: '&',
  },
  template,
  controller,
};

export default component;
