import routing from './hosting.routes';

import cdn from './cdn/hosting-cdn.modules';
import database from './database/hosting-database.module';
import generalInformations from './general-informations/general-informations.module';
import websiteCoach from './website-coach/website-coach.module';

const moduleName = 'ovhManagerHosting';

angular
  .module(moduleName, [
    cdn,
    database,
    generalInformations,
    'oui',
    'pascalprecht.translate',
    websiteCoach,
  ])
  .config(routing);

export default moduleName;
