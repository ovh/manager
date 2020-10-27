import angular from 'angular';

import easyPabx from './easyPabx';
import miniPabx from './miniPabx';

const moduleName = 'ovhManagerTelecomTelephonyAliasConfigurationMode';

angular.module(moduleName, [easyPabx, miniPabx]);

export default moduleName;
