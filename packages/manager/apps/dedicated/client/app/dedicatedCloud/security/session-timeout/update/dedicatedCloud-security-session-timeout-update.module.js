import angular from 'angular';

import datacenterSecuritySessionTimeoutUpdateComponent from '../../../../components/dedicated-cloud/security/session-timeout/update';
import routing from './dedicatedCloud-security-session-timeout-update.routing';

const moduleName = 'dedicatedCloudSecuritySessionTimeoutUpdate';

angular
  .module(moduleName, [datacenterSecuritySessionTimeoutUpdateComponent])
  .config(routing);

export default moduleName;
