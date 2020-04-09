import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import component from './migration.component';
import routing from './migration.routing';

const moduleName = 'ovhManagerDedicatedIpDashboardMigration';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component('ipDashboardMigration', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ../../translations */);

export default moduleName;
