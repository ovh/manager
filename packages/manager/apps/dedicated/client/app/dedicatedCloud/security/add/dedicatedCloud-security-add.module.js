import angular from 'angular';

import datacenterSecurityAddComponent from '../../../components/dedicated-cloud/security/add';
import routing from './dedicatedCloud-security-add.routing';

const moduleName = 'dedicatedCloudSecurityAdd';

angular.module(moduleName, [datacenterSecurityAddComponent]).config(routing);

export default moduleName;
