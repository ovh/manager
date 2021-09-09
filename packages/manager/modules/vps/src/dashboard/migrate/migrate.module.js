import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ui-kit';

import ovhManagerCatalogPrice from '@ovh-ux/manager-catalog-price';
import routing from './migrate.routing';
import component from './migrate.component';
import confirm from './migrate-confirm';

const moduleName = 'ovhManagerVpsMigrate';

angular
  .module(moduleName, ['oui', 'ui.router', confirm, ovhManagerCatalogPrice])
  .config(routing)
  .component('ovhManagerVpsDashboardMigrateVps', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
