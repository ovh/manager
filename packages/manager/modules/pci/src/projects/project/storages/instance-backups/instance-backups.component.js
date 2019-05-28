import controller from './instance-backups.controller';
import template from './instance-backups.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    addInstanceBackup: '<',
    instanceBackups: '<',
    createInstance: '<',
    deleteInstanceBackup: '<',
  },
};
