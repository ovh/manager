import angular from 'angular';

import datacenterSecuritySimultaneousConnectionUpdateComponent from '../../../../components/dedicated-cloud/security/simultaneous-connection/update';
import routing from './dedicatedCloud-security-simultaneous-connection-update.routing';

const moduleName = 'dedicatedCloudSecuritySimultaneousConnectionUpdate';

angular
  .module(moduleName, [datacenterSecuritySimultaneousConnectionUpdateComponent])
  .config(routing);

export default moduleName;
