import angular from 'angular';

import activateProjectBanner from './activate-project-banner';
import projectDashboardActivateBanner from './project-dashboard-activate-banner';

const moduleName = 'pciProjectComponents';

angular.module(moduleName, [
  activateProjectBanner,
  projectDashboardActivateBanner,
]);

export default moduleName;
