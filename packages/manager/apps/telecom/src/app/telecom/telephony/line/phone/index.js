import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import accessories from './accessories';
import attachLine from './attachLine';
import codec from './codec';
import configuration from './configuration';
import details from './details';
import order from './order';
import phonebook from './phonebook';
import programmableKeys from './programmableKeys';
import reboot from './reboot';

import routing from './phone.routing';

const moduleName = 'ovhManagerTelecomTelephonyLinePhone';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
    'ovh-api-services',
    accessories,
    attachLine,
    codec,
    configuration,
    details,
    order,
    phonebook,
    programmableKeys,
    reboot,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
