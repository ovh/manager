import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-payment-method';
import '@uirouter/angularjs';
import 'angular-translate';

import './index.scss';

import userPanel from './components/user-panel';

const moduleName = 'ovhManagerHub';

angular.module(moduleName, [
  'ovhManagerCore',
  'pascalprecht.translate',
  'ui.router',
  userPanel,
]);

export default moduleName;
