import angular from 'angular';

import routing from './dedicatedCloud-user-delete.routes';
import userDeleteComponent from '../../../components/dedicated-cloud/user/delete';

const moduleName = 'dedicatedCloudUserDeleteModule';

angular.module(moduleName, [userDeleteComponent]).config(routing);

export default moduleName;
