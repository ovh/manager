import angular from 'angular';

import datacenterSecurityKmsDeleteComponent from '../../../../components/dedicated-cloud/security/kms/delete';
import routing from './dedicatedCloud-security-kms-delete.routing';

const moduleName = 'dedicatedCloudSecurityKmsDelete';

angular
  .module(moduleName, [datacenterSecurityKmsDeleteComponent])
  .config(routing);

export default moduleName;
