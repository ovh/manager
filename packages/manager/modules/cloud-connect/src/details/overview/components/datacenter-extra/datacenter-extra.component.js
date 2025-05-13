import controller from './datacenter-extra.controller';
import template from './template.html';

export default {
  bindings: {
    datacenter: '<',
    extraConfig: '<',
    removeExtra: '&',
    checkBgpPeering: '<',
  },
  controller,
  template,
};
