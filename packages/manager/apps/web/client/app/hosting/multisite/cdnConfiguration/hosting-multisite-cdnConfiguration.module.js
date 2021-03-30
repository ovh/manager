import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';

import component from './hosting-multisite-cdnConfiguration.component';
import routing from './hosting-multisite-cdnConfiguration.routing';

const moduleName = 'ovhManagerHostingMultisiteCdnConfiguration';

angular
  .module(moduleName, [ngTranslateAsyncLoader, uiRouter])
  .component('hostingMultisiteCdnConfiguration', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
