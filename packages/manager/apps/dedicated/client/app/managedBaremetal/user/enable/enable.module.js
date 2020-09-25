import angular from 'angular';

import routing from './enable.routes';
import userEnableComponent from '../../../components/dedicated-cloud/user/enable';

const moduleName = 'managedBaremetalUserEnableModule';

angular.module(moduleName, [userEnableComponent]).config(routing);

export default moduleName;
