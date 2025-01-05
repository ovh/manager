import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    goBack: '<',
    availableVersions: '<',
    installNode: '<',
    handleSuccess: '<',
    handleError: '<',
    gatewayCidr: '<',
    ipUnavailable: '<',
  },
  template,
  controller,
};
