import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/telecom-universe-components';
import 'angularjs-scroll-glue';
import 'ovh-angular-tail-logs';

import constant from './overTheBox.constant';
import controller from './overTheBox.controller';
import template from './overTheBox.html';

import configure from './configure';
import details from './details';
import docs from './docs';
import logs from './logs';
import order from './order';
import remote from './remote';
import tasks from './tasks';

import './overTheBox.less';

const moduleName = 'OvhManagerOverTheBoxComponent';

angular
  .module(moduleName, [
    'ovh-angular-tail-logs',
    'telecomUniverseComponents',
    'ovhManagerCore',
    configure,
    details,
    docs,
    logs,
    order,
    remote,
    tasks,
  ])
  .config(($stateProvider) => {
    $stateProvider.state('overTheBox', {
      url: '/overTheBox/:serviceName',
      abstract: true,
      component: 'ovhManagerOverTheBoxComponent',
      translations: [
        '.',
        './details',
        './warning',
        './remote',
      ],
      resolve: {
        $title(translations, $translate, $stateParams, OvhApiOverTheBox) {
          return OvhApiOverTheBox.v6().get({
            serviceName: $stateParams.serviceName,
          }).$promise.then(data => $translate.instant(
            'overTheBox_page_title', { name: data.customerDescription || $stateParams.serviceName }, null, null, 'escape',
          )).catch(() => $translate('overTheBox_page_title', { name: $stateParams.serviceName }));
        },
      },
    });
  })
  .component('ovhManagerOverTheBoxComponent', {
    template,
    controller,
    controllerAs: 'OverTheBox',
  })
  .constant('OVER_THE_BOX', constant)
  .constant('PAGINATION_PER_PAGE', 5);

export default moduleName;
