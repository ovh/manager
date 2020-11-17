import angular from 'angular';

import datacenterDrpMainPccComponent from '../../../../../../components/dedicated-cloud/datacenter/drp/configuration/common/mainPcc';
import routing from './ovhPccStep.routing';

const moduleName = 'managedBaremetalDatacenterDrpOnPremiseOvhPccStepModule';

angular.module(moduleName, [datacenterDrpMainPccComponent]).config(routing);

export default moduleName;
