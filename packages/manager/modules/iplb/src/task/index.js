import IpLoadBalancerDashboardHeaderCtrl from '../header/iplb-dashboard-header.controller';
import IpLoadBalancerTaskCtrl from './iplb-task.controller';
import IpLoadBalancerTaskPreviewCtrl from './preview/iplb-task-preview.controller';
import IpLoadBalancerTaskService from './iplb-task.service';

import IplbHeaderTemplate from '../header/iplb-dashboard-header.html';
import IplbTaskTemplate from './iplb-task.html';

const moduleName = 'ovhManagerIplbTask';

angular
  .module(moduleName, ['ui.router'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('iplb.detail.task', {
        url: '/task',
        views: {
          iplbHeader: {
            template: IplbHeaderTemplate,
            controller: 'IpLoadBalancerDashboardHeaderCtrl',
            controllerAs: 'ctrl',
          },
          iplbContent: {
            template: IplbTaskTemplate,
            controller: 'IpLoadBalancerTaskCtrl',
            controllerAs: 'ctrl',
          },
        },
        translations: {
          value: ['../task'],
          format: 'json',
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('iplb_task_title'),
        },
      });
    },
  )
  .controller(
    'IpLoadBalancerDashboardHeaderCtrl',
    IpLoadBalancerDashboardHeaderCtrl,
  )
  .controller('IpLoadBalancerTaskCtrl', IpLoadBalancerTaskCtrl)
  .service('IpLoadBalancerTaskService', IpLoadBalancerTaskService)
  .controller('IpLoadBalancerTaskPreviewCtrl', IpLoadBalancerTaskPreviewCtrl)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
