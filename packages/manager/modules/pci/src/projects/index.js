import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-api-wrappers'; // should be a peer dependency of ovh-api-services
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import newProject from './new';
import project from './project';

import routing from './projects.routing';

const moduleName = 'ovhManagerPciProjects';

angular
  .module(moduleName, [
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    newProject,
    project,
  ])
  .config(routing);

export default moduleName;
