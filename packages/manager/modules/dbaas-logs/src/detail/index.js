import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import ngOvhDocUrl from '@ovh-ux/ng-ovh-doc-url';
import 'ovh-api-services';
import 'ovh-ui-angular';

import 'ovh-ui-kit/dist/oui.css';
import './logs-detail.less';

import account from './account';
import component from './logs-detail.component';
import dashboards from './dashboards';
import home from './home';
import index from './index/index';
import inputs from './inputs';
import offer from './offer';
import logsDashboardHeader from '../header/dashboard';
import logsDetailService from './logs-detail.service';
import logsOrderService from './logs-order.service';
import logsHelperService from './logs-helper.service';
import options from './options';
import roles from './roles';
import routing from './logs-detail.routing';
import streams from './streams';
import tokens from './tokens';

const moduleName = 'ovhManagerDbaasLogsDetail';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    account,
    dashboards,
    home,
    index,
    inputs,
    offer,
    logsDashboardHeader,
    options,
    roles,
    streams,
    tokens,
    ngOvhDocUrl,
  ])
  .config(routing)
  .service('LogsDetailService', logsDetailService)
  .service('LogsHelperService', logsHelperService)
  .service('LogsOrderService', logsOrderService)
  .component('dbaasLogsDetail', component);

export default moduleName;
