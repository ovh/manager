import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-api-wrappers'; // should be a peer dependency of ovh-api-services
import 'angular-translate';
import '@ovh-ux/ui-kit';

import newModule from '../../new/module';
import component from './activate.component';
import routing from './activate.routing';
import projectService from '../project.service';

const moduleName = 'ovhManagerPciProjectActivate';

angular
  .module(moduleName, [
    'oui',
    'ovhManagerCore',
    'pascalprecht.translate',
    newModule,
  ])
  .config(routing)
  .component('pciProjectActivate', component)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service('projectService', projectService);

export default moduleName;
