import angular from 'angular';

import datacenterSecurityKmsAddComponent from '../../../../components/dedicated-cloud/security/kms/add';
import routing from './dedicatedCloud-security-kms-add.routing';

const moduleName = 'dedicatedCloudSecurityKmsAdd';

angular.module(moduleName, [datacenterSecurityKmsAddComponent]).config(routing);

export default moduleName;
