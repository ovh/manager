import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import component from './introduction.component';
import routing from './introduction.routing';

const moduleName = 'ovhManagerDedicatedServerDashboardSgxIntroduction';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component('dedicatedServerDashboardSgxIntroduction', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
