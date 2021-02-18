import template from './voicemail.html';
import controller from './voicemail.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.dashboard.voicemail',
    {
      url: '/voicemail',
      views: {
        faxInnerView: {
          template,
          controller,
          controllerAs: '$ctrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_group_fax_voicemail_breadcrumb'),
      },
    },
  );
};
