import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import component from './logs.component';
import routing from './logs.routing';
// import deleteNotebook from './delete-notebook';
// import stopNotebook from './stop-notebook';

const moduleName = 'ovhManagerPciJobGeneralInformation';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
  ])
  .config(routing)
  .component('ovhManagerPciProjectJobLogs', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
