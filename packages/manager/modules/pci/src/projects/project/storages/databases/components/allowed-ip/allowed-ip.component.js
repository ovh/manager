import controller from './allowed-ip.controller';
import template from './allowed-ip.html';

export default {
  controller,
  template,
  bindings: {
    allowedIp: '<?',
    database: '<',
    existingIps: '<?',
    goBack: '<',
    projectId: '<',
    trackDatabases: '<',
  },
};
