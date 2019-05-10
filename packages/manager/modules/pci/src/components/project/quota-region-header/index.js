import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';

import component from './header.component';

const moduleName = 'ovhManagerPciComponentsProjectQuotaHeader';

angular
  .module(moduleName, [
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('pciProjectQuotaHeader', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
