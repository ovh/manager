import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import logs from './logs';
import orders from './orders';
import rma from './rma';
import support from './support';
import troubleshooting from './troubleshooting';

import routing from './assist.routing';

const moduleName = 'ovhManagerTelecomTelephonyLineAssist';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
    logs,
    orders,
    rma,
    support,
    troubleshooting,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations ./troubleshooting/procedure/translations ./../../service/assist/translations */);

export default moduleName;
