import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';

import applicationAccess from '../../../instances/instance/application-access/application-access.module';
import routing from './application-access.routing';

const moduleName = 'ovhManagerPciBaremetalInstanceApplicationAccess';

angular
  .module(moduleName, [
    applicationAccess,
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing);

export default moduleName;
