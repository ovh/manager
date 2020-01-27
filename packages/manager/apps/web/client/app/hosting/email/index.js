import angular from 'angular';
import '@uirouter/angularjs';

import service from './hosting-email.service';
import terminate from './terminate/hosting-email-terminate.module';

const moduleName = 'webHostingEmail';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router', terminate])
  .service('hostingEmailService', service);

export default moduleName;
