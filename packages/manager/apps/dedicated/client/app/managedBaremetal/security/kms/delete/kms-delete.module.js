import angular from 'angular';

import datacenterSecurityKmsDeleteComponent from '../../../../components/dedicated-cloud/security/kms/delete';
import routing from './kms-delete.routing';

const moduleName = 'managedBaremetalSecurityKmsDelete';

angular
  .module(moduleName, [datacenterSecurityKmsDeleteComponent])
  .config(routing);

export default moduleName;
