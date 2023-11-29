import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-api-wrappers'; // should be a peer dependency of ovh-api-services
import '@ovh-ux/ng-ovh-feature-flipping';
import '@ovh-ux/ui-kit';
import 'angular-translate';
import 'ovh-api-services';
import trustedNic from '@ovh-ux/manager-trusted-nic';

import creatingProject from './creating';
import newProject from './new';
import onboarding from './onboarding';
import project from './project';
import remove from './remove';
import quotaExceedError from './quota-exceed-error';

import component from './projects.component';
import routing from './projects.routing';
import service from './projects.service';

const moduleName = 'ovhManagerPciProjects';

angular
  .module(moduleName, [
    'ngOvhFeatureFlipping',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    trustedNic,
    creatingProject,
    newProject,
    onboarding,
    project,
    remove,
    quotaExceedError,
  ])
  .config(routing)
  .component('pciProjects', component)
  .service('PciProjectsService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
