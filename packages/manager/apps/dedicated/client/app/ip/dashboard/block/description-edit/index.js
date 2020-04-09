import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import component from './description-edit.component';
import routing from './description-edit.routing';

const moduleName = 'ovhManagerDedicatedIpDashboardBlockDescriptionEdit';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component('ipDashboardBlockDescriptionEdit', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ../../../translations */);

export default moduleName;
