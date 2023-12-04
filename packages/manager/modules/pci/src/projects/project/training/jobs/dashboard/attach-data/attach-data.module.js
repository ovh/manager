import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import component from './attach-data.component';
import routing from './attach-data.routing';

const moduleName = 'ovhManagerPciJobAttachData';

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
  .component('ovhManagerPciProjectJobAttachData', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
