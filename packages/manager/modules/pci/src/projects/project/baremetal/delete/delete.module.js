import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';

import deleteModule from '../instance/delete/delete.module';
import routing from './delete.routing';

const moduleName = 'ovhManagerPciBaremetalDelete';

angular
  .module(moduleName, [
    deleteModule,
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing);

export default moduleName;
