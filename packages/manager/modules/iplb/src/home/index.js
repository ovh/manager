import angular from 'angular';
import '@uirouter/angularjs';

import IpLoadBalancerDashboardHeaderCtrl from '../header/iplb-dashboard-header.controller';

import IplbBulletChartComponent from './bullet-chart.component';
import IpLoadBalancerHomeComponent from './iplb-home.component';

import IpLoadBalancerHomeService from './iplb-home.service';
import IpLoadBalancerHomeStatusService from './iplb-home-status.service';

import OvhManagerIplbFailoverIp from './failover-ip';
import OvhManagerIplbHomeCipher from './cipher';
import OvhManagerIplbNatIpDetail from './nat-ip';
import OvhManagerIplbUpdateQuota from './updateQuota';

import routing from './iplb-home.routing';

import './bullet-chart.less';
import './status-card.less';
import './home.less';

const moduleName = 'ovhManagerIplbHome';

angular
  .module(moduleName, [
    OvhManagerIplbFailoverIp,
    OvhManagerIplbHomeCipher,
    OvhManagerIplbNatIpDetail,
    OvhManagerIplbUpdateQuota,
    'ui.router',
  ])
  .config(routing)
  .component('ovhManagerIplbHomeComponent', IpLoadBalancerHomeComponent)
  .controller('IpLoadBalancerDashboardHeaderCtrl', IpLoadBalancerDashboardHeaderCtrl)
  .directive('iplbBulletChart', IplbBulletChartComponent)
  .service('IpLoadBalancerHomeService', IpLoadBalancerHomeService)
  .service('IpLoadBalancerHomeStatusService', IpLoadBalancerHomeStatusService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
