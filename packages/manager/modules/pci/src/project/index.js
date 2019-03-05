import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'oclazyload';
import 'ovh-ui-angular';

import add from './add';
import billing from './billing';
import details from './details';
import onboarding from './onboarding';
import rename from './rename';

import template from './template.html';

import './index.less';

const moduleName = 'ovhManagerPciProject';

angular
  .module(moduleName, [
    add,
    billing,
    details,
    'ui.router',
    'oc.lazyLoad',
    'oui',
    'ovhManagerCore',
    onboarding,
    rename,
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider
    /**
     * EXISTING PROJECT
     * #/cloud/project/projectId
     */
    // View project by project id
      .state('iaas.pci-project', {
        url: '/pci/project/{projectId}',
        abstract: true, // [don't touch] empty url goes to cloud-project.cloud-project-details
        template,
        // controller: 'CloudProjectCtrl',
        controllerAs: 'CloudProjectCtrl',
        translations: {
          value: ['.', './billing'],
          format: 'json',
        },
        atInternet: { ignore: true },
      });
  });

export default moduleName;
