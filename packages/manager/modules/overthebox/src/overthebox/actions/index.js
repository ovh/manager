import angular from 'angular';

import 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'ovh-api-services';

import component from './overTheBox-actions.component';
import routing from './overTheBox-actions.routing';

const moduleName = 'ovhManagerOtbActions';

angular
  .module(moduleName, [ngTranslateAsyncLoader, 'ui.router', 'ovh-api-services'])
  .component('overTheBoxActions', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
