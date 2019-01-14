import angular from 'angular';
import groupFaxFactory from './telephony-group-fax.factory';

const moduleName = 'ovhManagerTelephonyGroupFax';

angular.module(moduleName, [])
  .factory('TelephonyGroupFax', groupFaxFactory);

export default moduleName;
