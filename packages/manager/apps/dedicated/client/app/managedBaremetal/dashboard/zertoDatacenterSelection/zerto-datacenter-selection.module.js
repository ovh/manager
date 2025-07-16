import angular from 'angular';

import datacenterSelectionComponent from '../../../components/dedicated-cloud/zertoDatacenterSelection';
import routing from './zerto-datacenter-selection.routing';

const moduleName = 'managedBaremetalZertoDatacenterSelectionModule';

angular.module(moduleName, [datacenterSelectionComponent]).config(routing);

export default moduleName;
