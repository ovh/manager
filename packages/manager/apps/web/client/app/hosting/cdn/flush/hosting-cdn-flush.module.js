import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';

import component from './hosting-cdn-flush.component';
import routing from './hosting-cdn-flush.routing';

const moduleName = 'ovhManagerHostingCdnFlush';

angular
  .module(moduleName, [ngTranslateAsyncLoader, uiRouter])
  .component('hostingFlushCdnComponent', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
