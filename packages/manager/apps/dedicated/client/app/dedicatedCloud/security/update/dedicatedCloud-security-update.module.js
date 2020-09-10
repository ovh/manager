import angular from 'angular';

import datacenterSecurityUpdateComponent from '../../../components/dedicated-cloud/security/update';
import routing from './dedicatedCloud-security-update.routing';

const moduleName = 'dedicatedCloudSecurityUpdate';

angular.module(moduleName, [datacenterSecurityUpdateComponent]).config(routing);

export default moduleName;
