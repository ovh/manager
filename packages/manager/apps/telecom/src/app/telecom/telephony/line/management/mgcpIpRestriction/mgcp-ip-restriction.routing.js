import template from './mgcp-ip-restriction.html';
import controller from './mgcp-ip-restriction.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.mgcpIpRestriction',
    {
      url: '/mgcpIpRestriction',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          template,
          controller,
          controllerAs: 'MgcpIpRestrictionCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_line_mgcp_ip_restriction_title'),
      },
    },
  );
};
