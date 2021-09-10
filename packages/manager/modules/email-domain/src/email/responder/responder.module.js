import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import create from './create';
import responderDelete from './delete';
import update from './update';
import routing from './responder.routing';

const moduleName = 'ovhManagerEmailDomainDashboardEmailResponder';

angular
  .module(moduleName, [
    create,
    responderDelete,
    update,
    ngTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
