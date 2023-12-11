import controller from './dedicated-server-ftp-backup-access-delete.controller';
import template from './dedicated-server-ftp-backup-access-delete.html';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
    ipbackup: '<',
  },
};
