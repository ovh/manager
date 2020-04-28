import controller from './pack-voipLine-activation.controller';
import template from './pack-voipLine-activation.html';

export default {
  controller,
  template,
  bindings: {
    packName: '<',
    goBack: '<',
  },
};
