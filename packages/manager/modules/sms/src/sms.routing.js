import get from 'lodash/get';
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { HEADER_GUIDE_LINK } from './sms.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    views: {
      '': {
        component: 'ovhManagerSms',
      },
    },
    params: ListLayoutHelper.stateParams,
    resolve: {
      apiPath: () => '/sms',
      ...ListLayoutHelper.stateResolves,
      defaultFilterColumn: () => 'name',
      dataModel: () => 'sms.Account',
      smsStatusTypes: /* @ngInject */ (schema) =>
        get(schema.models, 'sms.StatusAccountEnum').enum,
      smsChannelEnum: /* @ngInject */ (schema) =>
        get(schema.models, 'sms.ChannelEnum').enum,
      getSmsLink: /* @ngInject */ ($state) => ({ name: serviceName }) =>
        $state.href('sms.service.dashboard', {
          serviceName,
        }),
      viewSms: /* @ngInject */ ($state) => ({ name: serviceName }) =>
        $state.go('sms.service.dashboard', {
          serviceName,
        }),
      hideBreadcrumb: () => true,
      gotoOrder: /* @ngInject */ ($state, atInternet) => () => {
        atInternet.trackClick({
          name: 'sms::index::order',
          type: 'action',
        });
        $state.go('sms.order');
      },
      headerGuideLink: /* @ngInject */ (coreConfig, $translate) =>
        HEADER_GUIDE_LINK.map(({ translationKey, url }) => ({
          label: $translate.instant(`sms_header_guide_${translationKey}`),
          url: url[coreConfig.getUser().ovhSubsidiary] || url.DEFAULT,
        })),
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.data.length === 0 ? 'sms.onboarding' : false,
        ),
  });
};
