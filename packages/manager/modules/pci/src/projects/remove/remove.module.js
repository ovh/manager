import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';

import remove from '../project/edit/remove/remove.module';
import routing from './remove.routing';

const moduleName = 'ovhManagerPciProjectsRemove';

angular
  .module(moduleName, ['ui.router', 'pascalprecht.translate', remove])
  .config(routing);

export default moduleName;
