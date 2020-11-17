import angular from 'angular';

import datacenterSecuritySimultaneousConnectionUpdateComponent from '../../../../components/dedicated-cloud/security/simultaneous-connection/update';
import routing from './simultaneous-connection-update.routing';

const moduleName = 'managedBaremetalSecuritySimultaneousConnectionUpdate';

angular
  .module(moduleName, [datacenterSecuritySimultaneousConnectionUpdateComponent])
  .config(routing);

export default moduleName;
