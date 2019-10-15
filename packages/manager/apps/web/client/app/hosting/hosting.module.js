import routing from './hosting.routes';

import cdn from './cdn/hosting-cdn.modules';
import generalInformations from './general-informations/general-informations.module';
import websiteCoach from './website-coach/website-coach.module';

import hostingCtrl from './hosting.controller';
import hostingTabsCtrl from './hosting-tabs.controller';

const moduleName = 'ovhManagerHosting';

angular
  .module(moduleName, [
    cdn,
    generalInformations,
    websiteCoach,
  ])
  .controller('HostingCtrl', hostingCtrl)
  .controller('HostingTabsCtrl', hostingTabsCtrl)
  .config(routing);

export default moduleName;
