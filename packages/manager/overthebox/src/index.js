import 'ovh-angular-tail-logs';
import 'angularjs-scroll-glue';

import angular from 'angular';
import '@ovh-ux/manager-core';

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

const moduleName = 'ovhManagerOtb';
angular.module(moduleName, [
  'ui.router',
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
  .constant('OVER_THE_BOX', constant)
  .constant('PAGINATION_PER_PAGE', 5)
  .config(($stateProvider) => {
    $stateProvider.state('overTheBox', {
      url: '/overTheBox/:serviceName',
      abstract: true,
      template,
      controller,
      controllerAs: 'OverTheBox',
      translations: [
        '.',
        './details',
        './warning',
        './remote',
      ],
      /*
      resolve: {
        $title(translations, $translate, $stateParams, OvhApiOverTheBox) {
          return OvhApiOverTheBox.v6().get({
            serviceName: $stateParams.serviceName,
          }).$promise.then(data => $translate.instant(
            'overTheBox_page_title', {
              name: data.customerDescription || $stateParams.serviceName }, null, null, 'escape')
          ).catch(() => $translate('overTheBox_page_title', { name: $stateParams.serviceName }));
        },
      },
      */
    });
  });

export default moduleName;
