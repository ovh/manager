import angular from 'angular';

import routing from './enable.routes';
import userEnableComponent from '../../../../components/dedicated-cloud/users/vsphere-users/enable';

const moduleName = 'managedBaremetalUserEnableModule';

angular.module(moduleName, [userEnableComponent]).config(routing);

export default moduleName;
