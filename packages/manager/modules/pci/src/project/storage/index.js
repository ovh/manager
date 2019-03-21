import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'oclazyload';
import 'ovh-ui-angular';

import add from './add';
import details from './details';
import services from './services';

import controller from './controller';
import template from './template.html';

const moduleName = 'ovhManagerPciProjectStorage';

angular
  .module(moduleName, [
    add,
    details,
    'ui.router',
    'oc.lazyLoad',
    'oui',
    'ovhManagerCore',
    services,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider
      .state('iaas.pci-project.compute.storage', {
        url: '/storage',
        views: {
          cloudProjectCompute: {
            template,
            controller,
            controllerAs: 'RA.storageCtrl',
          },
        },
      });
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
