import controller from './vps-schedule-backup.controller';
import template from './vps-schedule-backup.html';

export default {
  bindings: {
    goBack: '<',
    serviceName: '<',
    automatedBackupOption: '<',
  },
  controller,
  template,
};
