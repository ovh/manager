import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/manager-filters';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-ovh-doc-url';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import './logs-detail.less';

import component from './detail.component';
import routing from './detail.routing';

import account from './account/account.module';
import dashboards from './dashboards/dashboards.module';
import home from './home/home.module';
import index from './index/index.module';
import inputs from './inputs/inputs.module';
import osd from './osd/osd.module';
import logsDashboardHeader from '../header/header.module';
import logsDetailService from './logs-detail.service';
import logsOrderService from './logs-order.service';
import logsHelperService from './logs-helper.service';
import roles from './roles/roles.module';
import streams from './streams/streams.module';
import tokens from './tokens/tokens.module';
import encryptionKeys from './encryption-keys/encryption-keys.module';

const moduleName = 'ovhManagerDbaasLogsDetail';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovhManagerFilters',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    account,
    dashboards,
    home,
    index,
    inputs,
    osd,
    logsDashboardHeader,
    roles,
    streams,
    tokens,
    encryptionKeys,
    'ngOvhDocUrl',
  ])
  .config(routing)
  .service('LogsDetailService', logsDetailService)
  .service('LogsHelperService', logsHelperService)
  .service('LogsOrderService', logsOrderService)
  .component('dbaasLogsDetail', component);

export default moduleName;
