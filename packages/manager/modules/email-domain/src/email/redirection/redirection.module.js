import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import create from './create';
import redirectionDelete from './delete';
import routing from './redirection.routing';
import update from './update';

const moduleName = 'ovhManagerEmailDomainDashboardEmailRedirection';

angular
  .module(moduleName, [
    create,
    redirectionDelete,
    ngTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
    update,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
