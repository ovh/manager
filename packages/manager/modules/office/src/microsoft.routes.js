import set from 'lodash/set';

import controller from './office/license/microsoft-office-license.controller';
import template from './office/license/microsoft-office-license.html';

const routeBase = 'app.microsoft.office';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(routeBase, {
    abstract: true,
    template: '<div ui-view></div>',
    translations: {
      value: ['.'],
      format: 'json',
    },
  });

  $stateProvider.state(`${routeBase}.product`, {
    url: '/configuration/microsoft/office/license/:serviceName?tab',
    template,
    controller,
    controllerAs: 'MicrosoftOfficeLicenseCtrl',
    reloadOnSearch: false,
    params: {
      tab: null,
    },
    resolve: {
      navigationInformations: /* @ngInject */ (Navigator, $rootScope) => {
        set($rootScope, 'currentSectionInformation', 'microsoft');
        return Navigator.setNavigationInformation({
          leftMenuVisible: true,
          configurationSelected: true,
        });
      },
    },
  });
};
