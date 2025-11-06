import angular from 'angular';

import DatacenterZertoMainPccComponent from '../../../../../../components/dedicated-cloud/datacenter/zerto/configuration/common/mainPcc';
import routing from './ovhPccStep.routing';

const moduleName = 'managedBaremetalDatacenterZertoOnPremiseOvhPccStepModule';

angular.module(moduleName, [DatacenterZertoMainPccComponent]).config(routing);

export default moduleName;
