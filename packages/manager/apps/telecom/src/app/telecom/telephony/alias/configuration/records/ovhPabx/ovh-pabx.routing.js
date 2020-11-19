import template from './ovh-pabx.html';
import controller from './ovh-pabx.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.configuration.recordsOvhPabx',
    {
      url: '/ovhPabx/records',
      views: {
        'aliasView@telecom.telephony.billingAccount.alias.details': {
          template,
          controller,
          controllerAs: 'RecordsOvhPabxCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_alias_configuration_records_title'),
      },
    },
  );
};
