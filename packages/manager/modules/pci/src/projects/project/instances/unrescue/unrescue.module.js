import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import unrescue from '../instance/unrescue/unrescue.module';
import routing from './unrescue.routing';

const moduleName = 'ovhManagerPciInstancesUnrescue';

angular
  .module(moduleName, [
    unrescue,
    'ui.router',
    'oui',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing);

export default moduleName;
