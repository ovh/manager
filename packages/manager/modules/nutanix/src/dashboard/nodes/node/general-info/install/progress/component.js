import template from './template.html';

export default {
  bindings: {
    server: '<',
    serviceName: '@',
    goBack: '<',
    bringYourOwnImage: '<',
    goToOsInstallChooseSource: '<',
  },
  template,
};
