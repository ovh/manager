import angular from 'angular';

import routing from './dedicatedCloud-user-disable.routes';
import userDisableComponent from '../../../components/dedicated-cloud/user/disable';

const moduleName = 'dedicatedCloudUserDisableModule';

angular.module(moduleName, [userDisableComponent]).config(routing);

export default moduleName;
