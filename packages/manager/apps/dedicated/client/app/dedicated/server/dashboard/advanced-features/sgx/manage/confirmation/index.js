import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import component from './confirmation.component';
import routing from './confirmation.routing';

const moduleName = 'ovhManagerDedicatedServerDashboardSgxManageConfirmation';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component('dedicatedServerDashboardSgxManageConfirmation', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
