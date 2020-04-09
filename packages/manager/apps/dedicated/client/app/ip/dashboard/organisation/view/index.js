import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import component from './view.component';
import routing from './view.routing';

const moduleName = 'ovhManagerDedicatedIpDashboardOrganisationView';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component('ipDashboardOrganisationView', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ../../../translations */);

export default moduleName;
