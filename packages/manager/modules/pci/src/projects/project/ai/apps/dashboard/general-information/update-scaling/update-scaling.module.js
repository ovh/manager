import angular from 'angular';
import '@uirouter/angularjs';

import updateScalingComponent from '../../../components/update-scaling';
import routing from './update-scaling.routing';

const moduleName = 'ovhManagerPciAppsAppDashboardUpdateAppScaling';

angular
  .module(moduleName, ['ui.router', updateScalingComponent])
  .config(routing);

export default moduleName;
