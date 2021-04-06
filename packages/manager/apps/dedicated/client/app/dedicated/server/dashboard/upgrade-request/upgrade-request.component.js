import controller from './upgrade-request.controller';
import template from './upgrade-request.html';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
    issueTypes: '<',
    region: '<',
    serverName: '<',
    selectedUpgrade: '<',
  },
};
