import angular from 'angular';

import WucExchangePassword from './exchange.password.service';

const moduleName = 'wucExchangePassword';

angular
  .module(moduleName, [])
  .service('wucExchangePassword', WucExchangePassword);

export default moduleName;
