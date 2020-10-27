import template from './ovh-pabx.html';
import controller from './ovh-pabx.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.configuration.recordsOvhPabx',
    {
      url: '/ovhPabx/records',
      views: {
        'aliasView@telecom.telephony.billingAccount.alias': {
          template,
          controller,
          controllerAs: 'RecordsOvhPabxCtrl',
        },
      },
    },
  );
};
