import angular from 'angular';

import TucIpAddress from './ip-address.service';

const moduleName = 'tucIpAddress';

angular.module(moduleName, []).service('TucIpAddress', TucIpAddress);

export default moduleName;
