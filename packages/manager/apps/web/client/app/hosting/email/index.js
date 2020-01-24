import angular from 'angular';
import '@uirouter/angularjs';

import service from './hosting-email.service';

const moduleName = 'webHostingEmail';

angular
  .module(moduleName, ['ui.router'])
  .service('hostingEmailService', service);

export default moduleName;
