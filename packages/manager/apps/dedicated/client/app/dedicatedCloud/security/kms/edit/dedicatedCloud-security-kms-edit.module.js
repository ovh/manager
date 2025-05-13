import angular from 'angular';

import datacenterSecurityKmsEditComponent from '../../../../components/dedicated-cloud/security/kms/edit';
import routing from './dedicatedCloud-security-kms-edit.routing';

const moduleName = 'dedicatedCloudSecurityKmsEdit';

angular
  .module(moduleName, [datacenterSecurityKmsEditComponent])
  .config(routing);

export default moduleName;
