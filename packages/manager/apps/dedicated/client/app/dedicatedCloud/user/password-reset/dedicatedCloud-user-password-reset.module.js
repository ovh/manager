import angular from 'angular';

import routing from './dedicatedCloud-user-password-reset.routes';
import userPasswordResetComponent from '../../../components/dedicated-cloud/user/password/reset';

const moduleName = 'dedicatedCloudUserPasswordResetModule';

angular.module(moduleName, [userPasswordResetComponent]).config(routing);

export default moduleName;
