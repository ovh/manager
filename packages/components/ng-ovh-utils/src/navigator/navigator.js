import angular from 'angular';

import navigatorService from './navigator-service';

const moduleName = 'ua.navigator';

angular.module(moduleName, []).service('Navigator', navigatorService);

export default moduleName;
