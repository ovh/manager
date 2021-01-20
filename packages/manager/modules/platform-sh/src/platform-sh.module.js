import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ui-kit';

import add from './add';
import component from './platform-sh.component';
import details from './details';
import onboarding from './onboarding';
import routing from './platform-sh.routing';
import service from './platform-sh.service';
import terminateProject from './terminate';
import projectStatus from './components/project-status';

// import mockData from './platform-sh.data';

const moduleName = 'ovhManagerPlatformSh';

angular
  .module(moduleName, [
    onboarding,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ui.router',
    details,
    terminateProject,
    add,
    projectStatus,
  ])
  .config(routing)
  .component('platformSh', component)
  .service('PlatformSh', service)
  // .service('PlatformShMockData', mockData)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
