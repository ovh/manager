import controller from './ftp-backup-storage.controller';
import template from './ftp-backup-storage.html';

export default {
  bindings: {
    onError: '&?',
  },
  controller,
  template,
};
