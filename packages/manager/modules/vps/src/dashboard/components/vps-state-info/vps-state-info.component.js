import template from './vps-state-info.html';
import controller from './vps-state-info.controller';

export default {
  bindings: {
    vpsState: '<',
    isLocked: '<',
  },
  controller,
  template,
};
