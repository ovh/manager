import controller from './test-bgp-peering.controller';
import template from './template.html';

export default {
  bindings: {
    isExtar: '<',
    dcConfigId: '<',
    cloudConnectId: '<',
    goBack: '<',
    vRackId: '<',
    extraConfigId: '<',
    popConfigId: '<',
  },
  controller,
  template,
};
