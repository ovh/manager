import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-ui-angular';

import controller from './controller';
import template from './template.html';

import stepContainerTypeController from './step_container_type/controller';
import stepContainerTypeTemplate from './step_container_type/template.html';

import stepNameTemplate from './step_name/template.html';

import stepRegionController from './step_region/controller';
import stepRegionTemplate from './step_region/template.html';

const moduleName = 'ovhManagerPciProjectStorageAddStorage';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .controller('RA.add.storageCtrl', controller)
  .controller('RA.add.storage.stepContainerTypeCtrl', stepContainerTypeController)
  .controller('RA.add.storage.stepRegionCtrl', stepRegionController)
  .run(/* @ngInject */($templateCache) => {
    $templateCache.put('pci/project/storage/add/storage/template.html', template);
    $templateCache.put('pci/project/storage/add/storage/step_container_type/template.html', stepContainerTypeTemplate);
    $templateCache.put('pci/project/storage/add/storage/step_name/template.html', stepNameTemplate);
    $templateCache.put('pci/project/storage/add/storage/step_region/template.html', stepRegionTemplate);
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
