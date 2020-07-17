import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-api-wrappers'; // should be a peer dependency of ovh-api-services
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import guidesHeader from '../components/project/guides-header';

import creatingProject from './creating';
import newProject from './new';
import onboarding from './onboarding';
import project from './project';
import remove from './remove';

import component from './projects.component';
import routing from './projects.routing';
import service from './projects.service';

const moduleName = 'ovhManagerPciProjects';

angular
  .module(moduleName, [
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    guidesHeader,
    creatingProject,
    newProject,
    onboarding,
    project,
    remove,
  ])
  .config(routing)
  .component('pciProjects', component)
  .service('PciProjectsService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
