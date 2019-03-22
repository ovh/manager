import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'oclazyload';
import 'ovh-ui-angular';

import containerTasksRunnerService from './container-tasks-runner.service';
import containerService from './container.service';
import containersService from './containers.service';
import containersConfigurationService from './containersConfiguration.service';

const moduleName = 'ovhManagerPciProjectStorageServices';

angular
  .module(moduleName, [
    'oui',
    'ovhManagerCore',
  ])
  .service('CloudStorageContainerTasksRunner', containerTasksRunnerService)
  .service('CloudStorageContainer', containerService)
  .service('CloudStorageContainers', containersService)
  .service('CloudStorageContainersConfiguration', containersConfigurationService);

export default moduleName;
