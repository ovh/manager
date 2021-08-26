import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-web-universe-components';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import '@ovh-ux/ng-ovh-utils';

import routing from './metrics.routing';

const moduleName = 'ovhManagerPrivateDatabaseMetrics';

angular
  .module(moduleName, [
    'ngOvhWebUniverseComponents',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
    'ngOvhUtils',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
