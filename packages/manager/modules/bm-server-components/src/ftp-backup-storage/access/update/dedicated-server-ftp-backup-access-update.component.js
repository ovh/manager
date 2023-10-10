import controller from './dedicated-server-ftp-backup-access-update.controller';
import template from './dedicated-server-ftp-backup-access-update.html';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
    ipbackup: '<',
  },
};
