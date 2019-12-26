import angular from 'angular';
import ovhManagerCarrierSip from '@ovh-ux/manager-carrier-sip';

// Module dependencies.
import dashboard from './dashboard';

const moduleName = 'ovhManagerTelecomCarrierSip';

angular.module(moduleName, [dashboard, ovhManagerCarrierSip]);

export default moduleName;
