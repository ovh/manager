import angular from 'angular';

import '@ovh-ux/manager-kubernetes';

import routing from './routing';

const moduleName = 'ovhManagerPciProjectKubernetes';

angular
  .module(moduleName, [
    'ovhManagerKubernetes',
  ])
  .config(routing);

export default moduleName;
