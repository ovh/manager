import angular from 'angular';

import datacenterSelectionComponent from '../../../components/dedicated-cloud/drpDatacenterSelection';
import routing from './drp-datacenter-selection.routing';

const moduleName = 'managedBaremetalDrpDatacenterSelectionModule';

angular.module(moduleName, [datacenterSelectionComponent]).config(routing);

export default moduleName;
