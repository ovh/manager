import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import routing from './subscribers.routing';
import create from './create';
import subscribersDelete from './delete';

const moduleName = 'ovhManagerEmailDomainDashboardSubscribers';
angular
  .module(moduleName, [
    create,
    ngTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
    subscribersDelete,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
