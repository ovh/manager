import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './hosting-cdn-flush.component';

const moduleName = 'ovhManagerHostingCdnFlush';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('hostingCdnFlushComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
