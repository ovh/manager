import routing from './hosting.routes';

import cdn from './cdn/hosting-cdn.modules';
import generalInformations from './general-informations/general-informations.module';
import websiteCoach from './website-coach/website-coach.module';
import privateSqlActivation from './database/private-sql-activation';

const moduleName = 'ovhManagerHosting';

angular
  .module(moduleName, [
    cdn,
    generalInformations,
    'oui',
    'pascalprecht.translate',
    privateSqlActivation,
    websiteCoach,
  ])
  .config(routing);

export default moduleName;
