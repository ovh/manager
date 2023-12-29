import controller from './dedicated-server-ftp-backup-delete.controller';
import template from './dedicated-server-ftp-backup-delete.html';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
    ipbackup: '<',
  },
};
