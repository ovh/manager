import angular from 'angular';

import datacenterSecurityKmsEditComponent from '../../../../components/dedicated-cloud/security/kms/edit';
import routing from './kms-edit.routing';

const moduleName = 'managedBaremetalSecurityKmsEdit';

angular
  .module(moduleName, [datacenterSecurityKmsEditComponent])
  .config(routing);

export default moduleName;
