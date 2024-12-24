import controller from './check-bgp-peering.controller';
import template from './template.html';

export default {
  bindings: {
    isExtra: '<',
    dcConfigId: '<',
    cloudConnectId: '<',
    goBack: '<',
    extraConfigId: '<',
    popConfigId: '<',
  },
  controller,
  template,
};
