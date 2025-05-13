import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import routing from './routing';
import component from './component';
import service from '../creating/service';
import projectService from '../project/project.service';

import './index.scss';

const moduleName = 'ovhManagerPciProjectsUpdating';

angular
  .module(moduleName, [
    'ui.router',
    'ngAtInternet',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(component.name, component)
  .service('pciProjectCreating', service)
  .service('pciProjectService', projectService);

export default moduleName;
