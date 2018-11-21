import 'ovh-angular-tail-logs';
import 'angularjs-scroll-glue';

import angular from 'angular';
import telecomUniverseComponents from '@ovh-ux/telecom-universe-components';

import constant from './overTheBox.constant';
import controller from './overTheBox.controller';
import template from './overTheBox.html';

import ovhManagerOtbConfigure from './configure/overTheBox-configure';
import ovhManagerOtbDetails from './details/overTheBox-details';
import ovhManagerOtbDocs from './docs/overTheBox-docs';
import ovhManagerOtbLogs from './logs/overTheBox-logs';
import ovhManagerOtbOrder from './order/order-overTheBox';
import ovhManagerOtbRemote from './remote/overTheBox-remote';
import ovhManagerOtbTasks from './tasks/overTheBox-tasks';

const moduleName = 'ovhManagerOtb';
angular.module(moduleName, [
  'ui.router',
  telecomUniverseComponents,
  ovhManagerOtbConfigure,
  ovhManagerOtbDetails,
  ovhManagerOtbDocs,
  ovhManagerOtbLogs,
  ovhManagerOtbOrder,
  ovhManagerOtbRemote,
  ovhManagerOtbTasks,
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
          }).$promise.then(data => $translate.instant('overTheBox_page_title', { name: data.customerDescription || $stateParams.serviceName }, null, null, 'escape')).catch(() => $translate('overTheBox_page_title', { name: $stateParams.serviceName }));
        },
      },
      */
    });
  });

export default moduleName;
