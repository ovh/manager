import angular from 'angular';

import DatacenterZertoMainPccComponent from '../../../../../../components/dedicated-cloud/datacenter/zerto/configuration/common/mainPcc';
import routing from './dedicatedCloud-datacenter-zerto-onPremise-ovhPccStep.routing';

const moduleName = 'dedicatedCloudDatacenterZertoOnPremiseOvhPccStepModule';

angular.module(moduleName, [DatacenterZertoMainPccComponent]).config(routing);

export default moduleName;
