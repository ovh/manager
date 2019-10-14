import set from 'lodash/set';

import controller from './dns-zone-new.controller';
import template from './dns-zone-new.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dns-zone-new', {
    url: '/configuration/new_dns_zone',
    controller,
    controllerAs: 'ctrlNewDnsZone',
    template,
    resolve: {
      navigationInformations: /* @ngInject */ (Navigator, $rootScope) => {
        set($rootScope, 'currentSectionInformation', 'newDnsZone');
        return Navigator.setNavigationInformation({
          leftMenuVisible: true,
          configurationSelected: true,
        });
      },
    },
    translations: { value: ['.', '../../domains'], format: 'json' },
  });
}
