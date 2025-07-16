import angular from 'angular';

import DatacenterZertoMainPccComponent from '../../../../../../components/dedicated-cloud/datacenter/zerto/configuration/common/mainPcc';
import routing from './mainPccStep.routing';

const moduleName = 'managedBaremetalDatacenterZertoOvhMainPccStepModule';

angular.module(moduleName, [DatacenterZertoMainPccComponent]).config(routing);

export default moduleName;
