import controller from './dedicated-server-ftp-backup-password-request.controller';
import template from './dedicated-server-ftp-backup-password-request.html';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
    requestData: '<',
  },
};
