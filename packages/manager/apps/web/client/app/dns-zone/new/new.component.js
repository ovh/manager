import controller from './dns-zone-new.controller';
import template from './dns-zone-new.html';

export default {
  bindings: {
    catalog: '<',
    goBack: '<',
    isZoneValid: '<',
    user: '<',
  },
  controller,
  template,
};
