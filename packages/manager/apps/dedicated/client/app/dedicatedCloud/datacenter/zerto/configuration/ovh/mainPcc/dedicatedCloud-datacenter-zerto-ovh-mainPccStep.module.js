import angular from 'angular';

import DatacenterZertoMainPccComponent from '../../../../../../components/dedicated-cloud/datacenter/zerto/configuration/common/mainPcc';
import routing from './dedicatedCloud-datacenter-zerto-ovh-mainPccStep.routing';

const moduleName = 'dedicatedCloudDatacenterZertoOvhMainPccStepModule';

angular.module(moduleName, [DatacenterZertoMainPccComponent]).config(routing);

export default moduleName;
