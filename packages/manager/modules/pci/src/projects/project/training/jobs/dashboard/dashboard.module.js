import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ui-kit';

import component from './dashboard.component';
import generalInformation from './general-information';
import attachData from './attach-data';
import logs from './logs';
import routing from './dashboard.routing';

const moduleName = 'ovhManagerPciJobsDashboard';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ui.router',
    generalInformation,
    attachData,
    logs,
  ])
  .config(routing)
  .component('ovhManagerPciProjectJobsDashboard', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
