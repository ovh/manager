import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import resumeInstance from '../instance/resume/resume.module';
import routing from './resume.routing';

const moduleName = 'ovhManagerPciInstancesResume';

angular
  .module(moduleName, [
    resumeInstance,
    'ui.router',
    'oui',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing);

export default moduleName;
