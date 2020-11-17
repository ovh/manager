import angular from 'angular';

import datacenterSecuritySessionTimeoutUpdateComponent from '../../../../components/dedicated-cloud/security/session-timeout/update';
import routing from './session-timeout-update.routing';

const moduleName = 'managedBaremetalSecuritySessionTimeoutUpdate';

angular
  .module(moduleName, [datacenterSecuritySessionTimeoutUpdateComponent])
  .config(routing);

export default moduleName;
