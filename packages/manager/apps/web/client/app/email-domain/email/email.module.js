import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import routing from './email.routing';

import account from './account/email-account.module';
import acl from './acl/acl.module';
import delegate from './delegate';
import filter from './filter/filter.module';
import help from './help';
import redirection from './redirection/redirection.module';
import responder from './responder/responder.module';

const moduleName = 'ovhManagerEmailDomainDashboardEmail';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
    account,
    acl,
    delegate,
    filter,
    help,
    redirection,
    responder,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
