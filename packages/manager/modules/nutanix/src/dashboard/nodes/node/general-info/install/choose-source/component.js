import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    server: '<',
    goBack: '<',
    goToOsInstallOvh: '<',
    goToOsInstallGabarit: '<',
    goToOsInstallImage: '<',
  },
  controller,
  template,
};
