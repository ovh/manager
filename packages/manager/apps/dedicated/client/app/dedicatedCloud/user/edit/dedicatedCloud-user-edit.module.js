import angular from 'angular';

import routing from './dedicatedCloud-user-edit.routes';
import userEditComponent from '../../../components/dedicated-cloud/user/edit';

const moduleName = 'dedicatedCloudUserEditModule';

angular.module(moduleName, [userEditComponent]).config(routing);

export default moduleName;
