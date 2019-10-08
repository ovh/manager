import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import 'angular-translate';
import 'ovh-api-services';

import component from './add.component';
import routing from './add.routing';
import service from './add.service';

const moduleName = 'ovhManagerPciStreamsAdd';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'ngOvhCloudUniverseComponents',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .config(routing)
  .component('ovhManagerPciStreamsAdd', component)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service('ovhManagerPciStreamsAdd', service);

export default moduleName;
