import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import serviceConsumptionOutgoingFax from '../../../service/consumption/outgoingFax';

import routing from './outgoing-fax.routing';

const moduleName = 'ovhManagerTelecomTelephonyLineConsumptionOutgoingFax';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
    serviceConsumptionOutgoingFax,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
