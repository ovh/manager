import angular from 'angular';

import configurationTile from './configuration';
import informationTile from './information';

const moduleName = 'ovhManagerVpsDashboardTile';

angular.module(moduleName, [configurationTile, informationTile]);

export default moduleName;
