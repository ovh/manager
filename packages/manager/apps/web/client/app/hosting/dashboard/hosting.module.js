import routing from './hosting.routes';

import cdn from '../cdn/hosting-cdn.modules';
import database from '../database/hosting-database.module';
import generalInformations from '../general-informations/general-informations.module';
import multisiteDomainConfiguration from '../multisite/domain-configuration/configuration.module';
import websiteCoach from '../website-coach/website-coach.module';
import privateSqlActivation from '../database/private-sql-activation';
import userLogs from '../user-logs/user-logs.module';

const moduleName = 'ovhManagerHosting';

angular
  .module(moduleName, [
    cdn,
    database,
    generalInformations,
    multisiteDomainConfiguration,
    'oui',
    'pascalprecht.translate',
    privateSqlActivation,
    userLogs,
    websiteCoach,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
