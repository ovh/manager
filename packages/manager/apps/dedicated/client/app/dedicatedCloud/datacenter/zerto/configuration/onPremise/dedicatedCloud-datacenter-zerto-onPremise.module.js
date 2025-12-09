import angular from 'angular';

import routing from './dedicatedCloud-datacenter-zerto-onPremise.routing';
import DatacenterZertoMainPccComponent from '../../../../../components/dedicated-cloud/datacenter/zerto/configuration/common/mainPcc';

const moduleName = 'dedicatedCloudDatacenterZertoOnPremiseModule';

angular.module(moduleName, [DatacenterZertoMainPccComponent]).config(routing);

export default moduleName;
