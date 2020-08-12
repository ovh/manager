import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import routing from './mailing-list.routing';

import moderators from './moderators/moderators.module';
import subscribers from './subscribers/subscribers.module';

const moduleName = 'ovhManagerEmailDomainDashboardMailingList';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
    moderators,
    subscribers,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
