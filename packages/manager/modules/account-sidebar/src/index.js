import angular from 'angular';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import component from './component';

import './index.less';
import './index.scss';

import paymentMean from './payment-mean';
import shortcuts from './shortcuts';
import userInfos from './user-infos';

const moduleName = 'ovhManagerAccountSidebar';

angular
  .module(moduleName, [ngAtInternet, paymentMean, shortcuts, userInfos])
  .component('ovhManagerAccountSidebar', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
