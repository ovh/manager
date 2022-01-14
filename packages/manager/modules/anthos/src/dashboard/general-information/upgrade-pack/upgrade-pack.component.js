import template from './upgrade-pack.html';
import controller from './upgrade-pack.controller';

export default {
  bindings: {
    goBack: '<',
    pack: '<',
    packInfo: '<',
    pricingType: '<',
    workflowType: '<',
    workflowOptions: '<',
  },
  controller,
  template,
};
