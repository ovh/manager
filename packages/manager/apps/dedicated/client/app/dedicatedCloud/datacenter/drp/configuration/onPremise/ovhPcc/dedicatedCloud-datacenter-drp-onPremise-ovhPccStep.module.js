import angular from 'angular';

import datacenterDrpMainPccComponent from '../../../../../../components/dedicated-cloud/datacenter/drp/configuration/common/mainPcc';
import routing from './dedicatedCloud-datacenter-drp-onPremise-ovhPccStep.routing';

const moduleName = 'dedicatedCloudDatacenterDrpOnPremiseOvhPccStepModule';

angular.module(moduleName, [datacenterDrpMainPccComponent]).config(routing);

export default moduleName;
