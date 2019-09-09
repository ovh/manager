import controller from './instance-backups.controller';
import template from './instance-backups.html';

export default {
  controller,
  template,
  bindings: {
    addInstanceBackup: '<',
    createInstance: '<',
    deleteInstanceBackup: '<',
    instanceBackups: '<',
    guideUrl: '<',
    projectId: '<',
  },
};
