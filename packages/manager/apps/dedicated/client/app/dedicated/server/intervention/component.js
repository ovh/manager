import template from './template.html';

export default {
  bindings: {
    server: '<',
    goBack: '<',
    goToOsInstallOvh: '<',
    goToOsInstallGabarit: '<',
    goToOsInstallImage: '<',
    handleError: '<',
    handleSuccess: '<',
  },
  template,
};
