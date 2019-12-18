import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';

import resume from '../../../instances/instance/resume/resume.module';
import routing from './resume.routing';

const moduleName = 'ovhManagerPciBaremetalInstanceResume';

angular
  .module(moduleName, [
    resume,
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing);

export default moduleName;
