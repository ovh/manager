import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';

import cpuRamTemplate from './cpu-ram.html';
import cpuTemplate from './cpu.html';
import ramTemplate from './ram.html';

// TODO: import './index.less';

const moduleName = 'ovhManagerPciProjectComputeInfrastructurePopover';

angular
  .module(moduleName, [])
  .run(/* @ngInject */($templateCache) => {
    $templateCache.put('pci/project/compute/infrastructure/popover/cpu-ram.html', cpuRamTemplate);
    $templateCache.put('pci/project/compute/infrastructure/popover/cpu.html', cpuTemplate);
    $templateCache.put('pci/project/compute/infrastructure/popover/ram.html', ramTemplate);
  });

export default moduleName;
