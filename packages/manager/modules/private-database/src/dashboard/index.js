import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ng-ovh-web-universe-components';
import '@ovh-ux/manager-core';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import routing from './private-database.routing';

import configuration from '../configuration';
import database from '../database';
import logs from '../logs';
import metrics from '../metrics';
import orderCloudDb from '../order/clouddb';
import state from '../state';
import task from '../task';
import user from '../user';
import allowedIPs from '../whitelist';
import extension from '../database/extension';

const moduleName = 'ovhManagerWebPrivateDatabaseDashboard';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhWebUniverseComponents',
    'ngOvhUtils',
    'oui',
    'ui.router',
    allowedIPs,
    configuration,
    database,
    logs,
    metrics,
    orderCloudDb,
    state,
    task,
    user,
    extension,
  ])

  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
