import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import routing from './delegate.routing';

import filter from './filter/filter.module';
import responder from './responder/responder.module';

const moduleName = 'ovhManagerEmailDelegate';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
    filter,
    responder,
  ])
  .config(routing);

export default moduleName;
