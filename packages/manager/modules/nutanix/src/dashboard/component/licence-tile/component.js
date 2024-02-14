import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    packType: '<',
    hardwareInfo: '<',
    showPackType: '<',
  },
  controller,
  template,
};
