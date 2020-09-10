import angular from 'angular';

import datacenterSecurityLogoutComponent from '../../../components/dedicated-cloud/security/logout';
import routing from './dedicatedCloud-security-logout.routing';

const moduleName = 'dedicatedCloudSecurityLogout';

angular.module(moduleName, [datacenterSecurityLogoutComponent]).config(routing);

export default moduleName;
