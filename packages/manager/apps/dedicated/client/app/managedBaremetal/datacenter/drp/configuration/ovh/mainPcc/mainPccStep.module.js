import angular from 'angular';

import datacenterDrpMainPccComponent from '../../../../../../components/dedicated-cloud/datacenter/drp/configuration/common/mainPcc';
import routing from './mainPccStep.routing';

const moduleName = 'managedBaremetalDatacenterDrpOvhMainPccStepModule';

angular.module(moduleName, [datacenterDrpMainPccComponent]).config(routing);

export default moduleName;
