import angular from 'angular';

import dedicatedCloudConfirmTerminateComponent from '../../components/dedicated-cloud/terminate/confirm';
import routing from './dedicatedCloud-terminate-confirm.routes';

const moduleName = 'dedicatedCloudConfirmTerminateModule';

angular
  .module(moduleName, [dedicatedCloudConfirmTerminateComponent])
  .config(routing);

export default moduleName;
