import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    backupTariffUrl: '<',
    enabledBackupOffer: '<',
    trackingPrefix: '<',
  },
  controller,
  template,
};
