import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';

import component from './component';

const moduleName = 'ovhManagerBmServerComponentsServerReboot';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
  ])
  .component('serverReboot', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
