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
import profil from './profil';
import rateLimit from './rateLimit';
import XdslStatistics from './statistics';

import service from './pack-xdsl-access.service';

import './pack-xdsl-access.less';

const moduleName = 'ovhManagerTelecomPackXdslAccess';

angular
  .module(moduleName, [
    angularTranslate,
    comfortExchange,
    deconsolidation,
    diagnostic,
    diagnosticDetails,
    ipConfiguration,
    ipOder,
    ipv6,
    lineDiagnostic,
    notifications,
    'oui',
    portReset,
    profil,
    rateLimit,
    uiRouter,
    XdslStatistics,
    ngTranslateAsyncLoader,
  ])
  .component('packXdslAccess', access)
  .service('XdslAccessService', service);

export default moduleName;
