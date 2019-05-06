import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'oclazyload';
import 'ovh-ui-angular';

import componentsProjectRights from '../../../components/project/rights';

import add from './add';
import billing from './billing';
import compute from './compute';
import details from './details';
import openstack from './openstack';

import deleteController from './delete/controller';
import deleteTemplate from './delete/template.html';

import controller from './controller';
import template from './template.html';

const moduleName = 'ovhManagerPciProjectLegacy';

angular
  .module(moduleName, [
    add,
    billing,
    compute,
    details,
    'ui.router',
    componentsProjectRights,
    'oc.lazyLoad',
    'oui',
    'ovhManagerCore',
    openstack,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider
    /**
     * EXISTING PROJECT
     * #/cloud/project/projectId
     */
    // View project by project id
      .state('pci.projects.project.legacy', {
        url: '/legacy',
        abstract: true,
        template,
        controller,
        controllerAs: 'CloudProjectCtrl',
        atInternet: { ignore: true },
      });
  })
  .controller('CloudProjectDeleteCtrl', deleteController)
  .run(/* @ngInject */($templateCache) => {
    $templateCache.put('pci/project/delete/template.html', deleteTemplate);
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
