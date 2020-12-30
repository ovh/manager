import mainTemplate from './fax-main.html';
import template from './fax.html';
import controller from './fax.controller';

import managementTemplate from './management/management.html';
import managementController from './management/management.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.fax', {
    url: '/fax',
    template: '<div ui-view></div>',
    redirectTo: 'telecom.telephony.billingAccount.services',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('telephony_fax_breadcrumb'),
    },
  });

  $stateProvider.state('telecom.telephony.billingAccount.fax.dashboard', {
    url: '/:serviceName',
    views: {
      'telephonyView@telecom.telephony': {
        template,
      },
      'faxView@telecom.telephony.billingAccount.fax.dashboard': {
        template: mainTemplate,
        controller,
        controllerAs: '$ctrl',
      },
      'faxInnerView@telecom.telephony.billingAccount.fax.dashboard': {
        template: managementTemplate,
        controller: managementController,
        controllerAs: '$ctrl',
      },
    },
    resolve: {
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      $title($translate, serviceName) {
        return $translate('telephony_fax_page_title', {
          name: serviceName,
        });
      },
      faxDashboardLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.fax.dashboard',
          $transition$.params(),
        ),
      consumptionLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.fax.dashboard.consumption',
          $transition$.params(),
        ),
      voicemailLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.fax.dashboard.voicemail',
          $transition$.params(),
        ),
      faxLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.fax.dashboard.fax',
          $transition$.params(),
        ),
      contactLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.fax.dashboard.contact',
          $transition$.params(),
        ),
      assistLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.fax.dashboard.assist',
          $transition$.params(),
        ),

      currentActiveLink: /* @ngInject */ ($state, $transition$) => () =>
        $state.href($state.current.name, $transition$),
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,
    },
  });
};
