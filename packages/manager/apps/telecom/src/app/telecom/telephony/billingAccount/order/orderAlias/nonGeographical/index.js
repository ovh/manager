import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import coordinate from '../coordinate';
import numberChoice from '../numberChoice';
import retractation from '../retractation';

import routing from './non-geographical.routing';

const moduleName =
  'ovhManagerTelecomTelephonyBillingAccountOrderAliasNonGeographical';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    coordinate,
    numberChoice,
    retractation,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
