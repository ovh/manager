import angular from 'angular';

import datacenterSelectionComponent from '../../../components/dedicated-cloud/zertoDatacenterSelection';
import routing from './dedicatedCloud-zerto-datacenter-selection.routing';

const moduleName = 'dedicatedCloudZertoDatacenterSelectionModule';

angular.module(moduleName, [datacenterSelectionComponent]).config(routing);

export default moduleName;
