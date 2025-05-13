import routing from './private-database.routing';

import configuration from '../configuration/configuration.module';
import database from '../database/database.module';
import logs from '../logs/private-database-logs.module';
import metrics from '../metrics/metrics.module';
import orderCloudDb from '../order/clouddb';
import state from '../state/state.module';
import task from '../task/task.module';
import user from '../user/user.module';
import allowedIPs from '../whitelist/allowed-ips.module';

const moduleName = 'ovhManagerWebPrivateDatabaseDashboard';

angular
  .module(moduleName, [
    allowedIPs,
    configuration,
    database,
    logs,
    metrics,
    orderCloudDb,
    state,
    task,
    user,
  ])

  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(/* @ngTranslationsInject:json ./../../hosting/dashboard/translations */);

export default moduleName;
