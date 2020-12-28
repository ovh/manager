import angular from 'angular';

import datacenterSelectionComponent from '../../../components/dedicated-cloud/drpDatacenterSelection';
import routing from './dedicatedCloud-drp-datacenter-selection.routing';

const moduleName = 'dedicatedCloudDrpDatacenterSelectionModule';

angular.module(moduleName, [datacenterSelectionComponent]).config(routing);

export default moduleName;
