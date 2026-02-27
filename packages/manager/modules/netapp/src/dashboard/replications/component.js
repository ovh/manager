import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    replications: '<',
    sourceEFSNames: '<',
    serviceName: '<',
    goToApprouveReplication: '<',
    goToPromoteReplication: '<',
    goToDeleteReplication: '<',
  },
  controller,
  template,
};
