import angular from 'angular';

import datacenterSecurityKmsAddComponent from '../../../../components/dedicated-cloud/security/kms/add';
import routing from './kms-add.routing';

const moduleName = 'managedBaremetalSecurityKmsAdd';

angular.module(moduleName, [datacenterSecurityKmsAddComponent]).config(routing);

export default moduleName;
