import angular from 'angular';

import constants from './overTheBox.constant';
import controller from './overTheBox.controller';
import template from './overTheBox.html';

import overTheBoxConfigure from './configure/overTheBox-configure';

const moduleName = 'ovhManagerOtb';
angular.module(moduleName, [
  'ovhManagerOtbConfigure',
  'ovhManagerOtbDetails',
  'ovhManagerOtbDocs',
  'ovhManagerOtbLogs',
  'ovhManagerOtbOrder',
  'ovhManagerOtbRemote',
  'ovhManagerOtbTasks',
  'ovhManagerOtbWarning',
])
  .constants(constants)
  .config(($stateProvider) => {
    $stateProvider.state('telecom.overTheBox', {
      url: '/overTheBox/:serviceName',
      abstract: true,
      views: {
        'telecomView@telecom': {
          template,
          controller,
          controllerAs: 'OverTheBox',
        },
      },
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
          }).$promise.then(data => $translate.instant('overTheBox_page_title', { name: data.customerDescription || $stateParams.serviceName }, null, null, 'escape')).catch(() => $translate('overTheBox_page_title', { name: $stateParams.serviceName }));
        },
      },
    });
  })
  .config(overTheBoxConfigure);

export default moduleName;
