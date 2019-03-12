import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';

import controller from './controller';
import template from './template.html';
import service from './service';

// import './index.less';

const moduleName = 'ovhManagerPciProjectComputeInfrastructureOpenstackClient';

angular
  .module(moduleName, [
  ])
  .controller('CloudProjectComputeInfrastructureOpenstackClientCtrl', controller)
  .run(/* @ngInject */($templateCache) => {
    $templateCache.put('pci/project/compute/infrastructure/openstackClient/template.html', template);
  })
  .service('CloudProjectComputeInfrastructureOpenstackClientService', service);

export default moduleName;
