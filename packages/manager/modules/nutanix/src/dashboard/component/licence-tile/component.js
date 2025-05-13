import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    packType: '<',
    license: '<',
    showPackType: '<',
    isLegacyPack: '<',
  },
  controller,
  template,
};
