import mainTemplate from './fax-main.html';
import template from './fax.html';
import controller from './fax.controller';

import managementTemplate from './management/management.html';
import managementController from './management/management.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.fax', {
    url: '/fax/:serviceName',
    views: {
      'telephonyView@telecom.telephony': {
        template,
      },
      'faxView@telecom.telephony.billingAccount.fax': {
        template: mainTemplate,
        controller,
        controllerAs: '$ctrl',
      },
      'faxInnerView@telecom.telephony.billingAccount.fax': {
        template: managementTemplate,
        controller: managementController,
        controllerAs: '$ctrl',
      },
    },
    resolve: {
      $title(translations, $translate, $stateParams) {
        return $translate('telephony_fax_page_title', {
          name: $stateParams.serviceName,
        });
      },
    },
  });
};
