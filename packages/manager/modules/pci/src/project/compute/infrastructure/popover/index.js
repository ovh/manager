import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import cpuRamTemplate from './cpu-ram.html';
import cpuTemplate from './cpu.html';
import ramTemplate from './ram.html';

const moduleName = 'ovhManagerPciProjectComputeInfrastructurePopover';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .run(/* @ngInject */($templateCache) => {
    $templateCache.put('pci/project/compute/infrastructure/popover/cpu-ram.html', cpuRamTemplate);
    $templateCache.put('pci/project/compute/infrastructure/popover/cpu.html', cpuTemplate);
    $templateCache.put('pci/project/compute/infrastructure/popover/ram.html', ramTemplate);
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
