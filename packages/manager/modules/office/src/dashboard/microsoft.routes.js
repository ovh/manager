import set from 'lodash/set';

import controller from './microsoft-office-license.controller';
import template from './microsoft-office-license.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('office.product', {
    url: '/:serviceName',
    template,
    controller,
    controllerAs: 'MicrosoftOfficeLicenseCtrl',
    redirectTo: 'office.product.user',
    reloadOnSearch: false,
    resolve: {
      navigationInformations: /* @ngInject */ (Navigator, $rootScope) => {
        set($rootScope, 'currentSectionInformation', 'microsoft');
        return Navigator.setNavigationInformation({
          leftMenuVisible: true,
          configurationSelected: true,
        });
      },
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      userLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('office.product.user', $transition$.params()),
      consumptionLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('office.product.consumption', $transition$.params()),
      currentActiveLink: /* @ngInject */ ($state, $transition$) => () =>
        $state.href($state.current.name, $transition$.params()),
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,
    },
  });
};
