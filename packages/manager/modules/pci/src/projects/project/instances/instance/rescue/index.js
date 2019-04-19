import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';
import 'ovh-api-services';

import component from './rescue.component';

const moduleName = 'ovhManagerPciInstancesInstanceRescue';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('pciInstancesInstanceRescue', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
