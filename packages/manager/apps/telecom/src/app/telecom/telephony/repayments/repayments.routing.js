import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import controller from './repayments.controller';
import template from './repayments.html';

const { stateParams } = ListLayoutHelper;
const { sortOrder } = stateParams;

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('telecom.telephony.repayments', {
      url: '/repayments',
      views: {
        'telephonyView@telecom.telephony': {
          controller,
          template,
          controllerAs: '$ctrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_repayments_title'),
        svaWalletLink: /* @ngInject */ (coreURLBuilder) =>
          coreURLBuilder.buildURL('telecom', '#/telephony/sva-wallet'),
        hasSvaWallet: /* @ngInject */ ($q, $state, svaWallet) => {
          if (svaWallet && svaWallet.status === 'VALID') return true;
          return $q.reject().catch(() => {
            $state.go('telecom.telephony');
          });
        },
      },
    })
    .state('telecom.telephony.repayments.index', {
      url: `?${ListLayoutHelper.urlQueryParams}`,
      views: {
        listView: {
          component: 'telecomTelephonyRepaymentsList',
        },
      },
      params: {
        ...stateParams,
        sortOrder: {
          ...sortOrder,
          value: 'DESC',
        },
      },
      resolve: {
        ...ListLayoutHelper.stateResolves,
        apiPath: () => '/me/sva/cdr',
        dataModel: () => 'me.sva.Cdr',
        defaultFilterColumn: () => 'startDate',
        schema: /* @ngInject */ (OvhApiMe) => OvhApiMe.v6().schema().$promise,
        statusEnum: /* @ngInject */ (schema) =>
          schema.models['me.sva.cdr.StatusEnum'].enum,
        hideBreadcrumb: () => true,
      },
    });
};
