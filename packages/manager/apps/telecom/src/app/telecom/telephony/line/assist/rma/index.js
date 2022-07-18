import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import routing from './rma.routing';
import component from './rma.component';
import service from './rma.service';

import './rma.less';

const moduleName = 'ovhManagerTelecomTelephonyLineAssistRma';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
    'ovh-api-services',
  ])
  .config(routing)
  .component('lineAssistRmaComponent', component)
  .service('lineAssistRmaService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
