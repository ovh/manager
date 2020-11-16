import angular from 'angular';

import routing from './dedicatedCloud-user-add.routes';
import userAddComponent from '../../../components/dedicated-cloud/user/add';

const moduleName = 'dedicatedCloudUserAddModule';

angular.module(moduleName, [userAddComponent]).config(routing);

export default moduleName;
