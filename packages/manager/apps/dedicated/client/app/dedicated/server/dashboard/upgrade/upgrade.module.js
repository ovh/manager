import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './upgrade.component';
import routing from './upgrade.routing';

const moduleName = 'ovhManagerDedicatedServerDashboardUpgrade';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('dedicatedServerUpgrade', component)
  .config(routing)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
