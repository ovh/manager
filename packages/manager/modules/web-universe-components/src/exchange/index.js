import angular from 'angular';

import WucExchange from './exchange.service';

const moduleName = 'wucExchange';

angular.module(moduleName, []).service('wucExchange', WucExchange);

export default moduleName;
