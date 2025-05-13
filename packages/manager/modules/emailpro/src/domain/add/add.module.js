import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';

import controller from './emailpro-domain-add.controller';
import routing from './add.routing';

const moduleName = 'ovhManagerEmailProDashboardDomainAdd';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .controller('EmailProAddDomainController', controller)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
