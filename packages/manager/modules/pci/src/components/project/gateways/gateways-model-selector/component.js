import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    ovhSubsidiary: '<',
    onGatewaySizeSelection: '&',
  },
  controller,
  template,
};
