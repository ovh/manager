import angular from 'angular';
import component from './component';

import './index.scss';

import paymentMean from './payment-mean';
import userInfos from './user-infos';

const moduleName = 'ovhManagerHubUserPanel';

angular
  .module(moduleName, [paymentMean, userInfos])
  .component('ovhManagerHubUserPanel', component);

export default moduleName;
