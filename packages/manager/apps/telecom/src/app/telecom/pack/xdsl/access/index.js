import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';
import '@ovh-ux/ui-kit';

import diagnostic from './diagnostic';
import diagnosticDetails from './diagnostic/details';
import lineDiagnostic from './linediagnostic';
import access from './pack-xdsl-access.component';
import notifications from './notifications';
import comfortExchange from './comfortExchange/comfort-exchange.module';
import ipConfiguration from './ip';
import deconsolidation from './deconsolidation';
import ipOder from './ip/order';
import ipv6 from './ipv6';
import portReset from './portReset';

import XdslStatistics from './statistics';

const moduleName = 'ovhManagerTelecomPackXdslAccess';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    uiRouter,
    angularTranslate,
    'oui',
    diagnostic,
    diagnosticDetails,
    lineDiagnostic,
    notifications,
    comfortExchange,
    ipConfiguration,
    deconsolidation,
    XdslStatistics,
    ipOder,
    ipv6,
    portReset,
  ])
  .component('packXdslAccess', access);

export default moduleName;
