import controller from './backup.controller';
import template from './backup.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    instance: '<',
    isTrustedZone: '<',
    goBack: '<',
    snapshotAvailability: '<',
  },
};
