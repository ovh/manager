import angular from 'angular';

import routing from './password-reset.routes';
import userPasswordResetComponent from '../../../components/dedicated-cloud/user/password/reset';

const moduleName = 'managedBaremetalUserPasswordResetModule';

angular.module(moduleName, [userPasswordResetComponent]).config(routing);

export default moduleName;
