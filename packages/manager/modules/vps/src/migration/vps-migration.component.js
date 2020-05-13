import controller from './vps-migration.controller';
import template from './vps-migration.html';

export default {
  bindings: {
    catalog: '<',
    getAvailableMigrations: '<',
    getMigrationDetails: '<',
    getVpsDetails: '<',
    schedulePage: '<',
    user: '<',
    vpsList: '<',
    vpsDetailsPage: '<',
  },
  controller,
  template,
};
