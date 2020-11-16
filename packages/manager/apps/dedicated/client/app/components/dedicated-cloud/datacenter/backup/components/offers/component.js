import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    backup: '<',
    backupOffers: '<',
    currentOfferLabel: '<',
    previewMode: '<',
    user: '<',
    disabled: '<',
  },
  controller,
  template,
};
