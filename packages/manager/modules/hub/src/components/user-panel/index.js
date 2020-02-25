import angular from 'angular';
import component from './component';

import './index.scss';

import paymentMean from './payment-mean';
import shortcuts from './shortcuts';
import userInfos from './user-infos';

const moduleName = 'ovhManagerHubUserPanel';

angular
  .module(moduleName, [paymentMean, shortcuts, userInfos])
  .component('ovhManagerHubUserPanel', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
