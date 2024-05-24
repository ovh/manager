import template from './manage-contacts.html';
import controller from './manage-contacts.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.manageContacts', {
    url: '/manageContacts',
    views: {
      'groupInnerView@telecom.telephony.billingAccount': {
        template,
        controller,
        controllerAs: 'ManageContactsCtrl',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('telephony_group_manage_contacts_breadcrumb'),

      newSupportTicketLink: /* @ngInject */ (coreConfig, coreURLBuilder) =>
        coreConfig.isRegion(['EU', 'CA'])
          ? coreURLBuilder.buildURL('dedicated', '#/support/tickets/new')
          : '',
    },
  });
};
