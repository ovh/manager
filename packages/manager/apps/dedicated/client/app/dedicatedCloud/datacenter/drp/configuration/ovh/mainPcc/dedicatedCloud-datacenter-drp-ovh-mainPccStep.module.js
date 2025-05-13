import angular from 'angular';

import datacenterDrpMainPccComponent from '../../../../../../components/dedicated-cloud/datacenter/drp/configuration/common/mainPcc';
import routing from './dedicatedCloud-datacenter-drp-ovh-mainPccStep.routing';

const moduleName = 'dedicatedCloudDatacenterDrpOvhMainPccStepModule';

angular.module(moduleName, [datacenterDrpMainPccComponent]).config(routing);

export default moduleName;
