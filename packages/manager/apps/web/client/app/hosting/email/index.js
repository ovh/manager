import angular from 'angular';
import '@uirouter/angularjs';

import service from './hosting-email.service';
import activate from './activate';
import detach from './detach';
import terminate from './terminate/hosting-email-terminate.module';

const moduleName = 'webHostingEmail';

angular
  .module(moduleName, [
    activate,
    detach,
    'oui',
    'pascalprecht.translate',
    terminate,
    'ui.router',
  ])
  .service('hostingEmailService', service);

export default moduleName;
