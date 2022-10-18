import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';

import component from './terminate.component';

const moduleName = 'ovhManagerVpsComponentTerminate';

angular
  .module(moduleName, [
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('ovhManagerVpsComponentTerminate', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
