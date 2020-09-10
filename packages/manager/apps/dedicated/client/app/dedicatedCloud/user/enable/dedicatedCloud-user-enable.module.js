import angular from 'angular';

import routing from './dedicatedCloud-user-enable.routes';
import userEnableComponent from '../../../components/dedicated-cloud/user/enable';

const moduleName = 'dedicatedCloudUserEnableModule';

angular.module(moduleName, [userEnableComponent]).config(routing);

export default moduleName;
