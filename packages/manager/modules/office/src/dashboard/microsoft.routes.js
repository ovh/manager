import set from 'lodash/set';

import controller from './office/license/microsoft-office-license.controller';
import template from './office/license/microsoft-office-license.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('office.product', {
    url: '/:serviceName?tab',
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
