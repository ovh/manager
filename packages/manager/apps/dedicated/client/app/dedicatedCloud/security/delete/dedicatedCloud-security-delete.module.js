import angular from 'angular';

import datacenterSecurityDeleteComponent from '../../../components/dedicated-cloud/security/delete';
import routing from './dedicatedCloud-security-delete.routing';

const moduleName = 'dedicatedCloudSecurityDelete';

angular.module(moduleName, [datacenterSecurityDeleteComponent]).config(routing);

export default moduleName;
