import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import component from './general-information.component';
import routing from './general-information.routing';
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
    // notebooksConfigurationCommand,
    // addTag,
    // deleteNotebook,
    // stopNotebook,
  ])
  .config(routing)
  .component('ovhManagerPciProjectJobGeneralInformation', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
