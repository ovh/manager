import angular from 'angular';

import '@ovh-ux/ng-ovh-http';
import '@ovh-ux/ng-ovh-swimming-poll';

import upgrade from './upgrade';
import WucEmails from './email-domain.service';

const moduleName = 'wucEmailDomain';

angular
  .module(moduleName, ['ngOvhHttp', 'ngOvhSwimmingPoll', upgrade])
  .service('WucEmails', WucEmails);

export default moduleName;
