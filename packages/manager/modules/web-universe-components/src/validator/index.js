import angular from 'angular';

import WucValidator from './validator.service';

const moduleName = 'wucValidator';

angular.module(moduleName, []).service('WucValidator', WucValidator);

export default moduleName;
