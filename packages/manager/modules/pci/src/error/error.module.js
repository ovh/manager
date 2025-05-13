import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/manager-error-page';

import routing from './error.routing';

const moduleName = 'ovhManagerPciError';

angular
  .module(moduleName, [
    'oui',
    'ui.router',
    'ngTranslateAsyncLoader',
    'ovhManagerErrorPage',
    'pascalprecht.translate',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
