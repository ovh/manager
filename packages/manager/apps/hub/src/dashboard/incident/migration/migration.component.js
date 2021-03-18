import controller from './migration.controller';
import template from './template.html';

export default {
  bindings: {
    confirmMigration: '<',
    goToContracts: '<',
    impactedServices: '<',
    services: '<',
    servicesToMigrate: '<',
    trackingPrefix: '<',
    message: '<',
    shouldDisplayPriceTTC: '<',
  },
  controller,
  template,
};
