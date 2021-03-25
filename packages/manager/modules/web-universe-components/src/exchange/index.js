import angular from 'angular';
import '@ovh-ux/ng-ovh-api-wrappers';

import WucExchange from './exchange.service';

const moduleName = 'wucExchange';

angular
  .module(moduleName, ['ngOvhApiWrappers'])
  .service('wucExchange', WucExchange);

export default moduleName;
