import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';

import add from './add/add.module';
import routing from './domain.routing';

const moduleName = 'ovhManagerEmailProDashboardDomain';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    add,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
