import angular from 'angular';

import dedicatedCloudConfirmTerminateComponent from '../../components/dedicated-cloud/terminate/confirm';
import routing from './confirm-terminate.routes';

const moduleName = 'managedBaremetalConfirmTerminateModule';

angular
  .module(moduleName, [dedicatedCloudConfirmTerminateComponent])
  .config(routing);

export default moduleName;
