import template from './template.html';
import controller from './bandwidth-tile.controller';

export default {
  template,
  controller,
  bindings: {
    server: '<',
    ola: '<',
    bandwidth0ption: '<',
    bandwidthVrackOption: '<',
    bandwidthVrackOrderOption: '<',
    orderPrivateLink: '<',
    orderPublicLink: '<',
    specifications: '<',
  },
};
