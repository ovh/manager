import angular from 'angular';

import WucCronValidator from './cron-validator';

const moduleName = 'wucCronValidator';

angular.module(moduleName, []).service('WucCronValidator', WucCronValidator);

export default moduleName;
