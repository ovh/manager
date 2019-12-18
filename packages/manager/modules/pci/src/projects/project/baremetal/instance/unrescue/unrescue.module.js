import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';

import unrescue from '../../../instances/instance/unrescue/unrescue.module';
import routing from './unrescue.routing';

const moduleName = 'ovhManagerPciBaremetalInstanceUnrescue';

angular
  .module(moduleName, [
    unrescue,
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing);

export default moduleName;
