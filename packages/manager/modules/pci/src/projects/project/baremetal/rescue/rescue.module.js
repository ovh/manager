import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';

import rescue from '../instance/rescue/rescue.module';
import routing from './rescue.routing';

const moduleName = 'ovhManagerPciBaremetalStartRescue';

angular
  .module(moduleName, [
    rescue,
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing);

export default moduleName;
