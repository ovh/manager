import { MESSAGE_CONTAINER } from '../../details.constants';
import { STATUS } from '../../../../enterprise-cloud-database.constants';

export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('enterprise-cloud-database.service.details.settings.add-rule', {
      layout: 'modal',
      params: {
        securityGroup: null,
      },
      resolve: {
        goBack: /* @ngInject */ ($state, clusterId,
          CucCloudMessage, CucControllerHelper) => (message = false,
          type = STATUS.SUCCESS, securityGroupId = null) => {
          const reload = message && type === STATUS.SUCCESS;
          const state = 'enterprise-cloud-database.service.details.settings';
          const promise = $state.go(state, { clusterId, securityGroupId }, { reload });
          if (message) {
            promise.then(() => {
              CucCloudMessage[type](message, MESSAGE_CONTAINER);
              CucControllerHelper.scrollPageToTop();
            });
          }
          return promise;
        },
        securityGroup: /* @ngInject */ ($transition$) => $transition$.params().securityGroup,
      },
      translations: {
        value: ['.'],
        format: 'json',
      },
      url: '/add-rule',
      views: {
        modal: {
          component: 'enterpriseCloudDatabaseServiceDetailsSettingsCreateRuleComponent',
        },
      },
    });
};
