import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import component from './app-command.component';

const moduleName = 'ovhManagerPciAppsAppCommand';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .component('appCommand', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
