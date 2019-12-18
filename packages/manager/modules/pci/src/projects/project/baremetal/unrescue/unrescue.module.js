import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';

import routing from './unrescue.routing';
import unrescue from '../instance/unrescue/unrescue.module';

const moduleName = 'ovhManagerPciBaremetalUnrescue';

angular
  .module(moduleName, [
    unrescue,
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing);

export default moduleName;
