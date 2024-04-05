import angular from 'angular';

import activateProjectBanner from './activate-project-banner';
import projectDashboardActivateBanner from './project-dashboard-activate-banner';
import billingChangeBanner from './billing-change-banner';

const moduleName = 'pciProjectComponents';

angular.module(moduleName, [
  activateProjectBanner,
  projectDashboardActivateBanner,
  billingChangeBanner,
]);

export default moduleName;
