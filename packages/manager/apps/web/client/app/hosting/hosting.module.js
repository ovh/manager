import routing from './hosting.routes';

import generalInformations from './general-informations/general-informations.module';
import websiteCoach from './website-coach/website-coach.module';

const moduleName = 'ovhManagerHosting';

angular
  .module(moduleName, [
    generalInformations,
    websiteCoach,
  ])
  .config(routing);

export default moduleName;
