import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import routing from './routing';
import component from './hosting-cdn-shared-settings-cors.component';

const moduleName = 'ovhManagerHostingCdnSharedCors';
angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('hostingCdnSharedSettingsCors', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
