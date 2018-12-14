import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/manager-telecom-styles';
import '@ovh-ux/ng-tail-logs';
import '@ovh-ux/ng-uirouter-title';
import '@ovh-ux/telecom-universe-components';

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


const moduleName = 'OvhManagerOverTheBoxComponent';

angular
  .module(moduleName, [
    'ngTailLogs',
    'telecomUniverseComponents',
    'ovhManagerCore',
    'ngUirouterTitle',
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
      translations: {
        value: [
          '.',
          './details',
          './warning',
          './remote',
        ],
        format: 'json',
      },
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
