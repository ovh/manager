import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import routing from './email.routing';

import accountMigration from './account/migrate/migrate.module';
import acl from './acl/acl.module';
import filter from './filter/filter.module';
import redirection from './redirection/redirection.module';
import responder from './responder/responder.module';

const moduleName = 'ovhManagerEmailDomainDashboardEmail';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
    accountMigration,
    acl,
    filter,
    redirection,
    responder,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
