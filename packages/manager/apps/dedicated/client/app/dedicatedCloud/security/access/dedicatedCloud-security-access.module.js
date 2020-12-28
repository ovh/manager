import angular from 'angular';

import datacenterSecurityAccessComponent from '../../../components/dedicated-cloud/security/access';
import routing from './dedicatedCloud-security-access.routing';

const moduleName = 'dedicatedCloudSecurityAccess';

angular.module(moduleName, [datacenterSecurityAccessComponent]).config(routing);

export default moduleName;
