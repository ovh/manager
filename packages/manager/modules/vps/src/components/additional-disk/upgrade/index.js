import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';

import component from './upgrade.component';

const moduleName = 'ovhManagerVpsComponentAdditionalDiskUpgrade';

angular
  .module(moduleName, [
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('ovhManagerVpsComponentAdditionalDiskUpgrade', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
