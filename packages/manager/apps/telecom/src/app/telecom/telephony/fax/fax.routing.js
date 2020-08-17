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
      faxDashboardLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.fax',
          $transition$.params(),
        ),
      consumptionLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.fax.consumption',
          $transition$.params(),
        ),
      voicemailLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.fax.voicemail',
          $transition$.params(),
        ),
      faxLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.fax.fax',
          $transition$.params(),
        ),
      contactLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.fax.contact',
          $transition$.params(),
        ),
      assistLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.fax.assist',
          $transition$.params(),
        ),

      currentActiveLink: /* @ngInject */ ($state, $transition$) => () =>
        $state.href($state.current.name, $transition$),
    },
  });
};
