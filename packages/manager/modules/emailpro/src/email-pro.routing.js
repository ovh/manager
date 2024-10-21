import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { getEmailProOrderUrl } from './email-pro.order';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('email-pro.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'managerListLayout',
    params: ListLayoutHelper.stateParams,
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('noFiltersEmailPro')
        .then((noFiltersEmailPro) =>
          noFiltersEmailPro.data.length === 0
            ? { state: 'email-pro.onboarding' }
            : false,
        ),
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/email/pro',
      dataModel: () => 'email.pro.Service',
      defaultFilterColumn: () => 'domain',
      noFiltersEmailPro: /* @ngInject */ ($http) => $http.get('/email/pro'),
      header: /* @ngInject */ ($translate) =>
        $translate.instant('email_pro_title'),
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({ domain: productId }) =>
        $state.href('email-pro.dashboard', {
          productId,
        }),
      topbarOptions: /* @ngInject */ (
        $translate,
        $window,
        coreConfig,
        atInternet,
      ) => ({
        cta: {
          type: 'button',
          displayed: true,
          disabled: false,
          label: $translate.instant('email_pro_order'),
          value: $translate.instant('email_pro_order'),
          onClick: () => {
            atInternet.trackClick({
              name: 'email-pro::index::order',
              type: 'action',
            });
            $window.open(
              getEmailProOrderUrl(coreConfig.getUser().ovhSubsidiary),
              '_blank',
            );
          },
        },
      }),
      hideBreadcrumb: () => true,
    },
  });

  $stateProvider.state('mxplan.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'managerListLayout',
    params: ListLayoutHelper.stateParams,
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/email/mxplan',
      dataModel: () => 'email.mxplan.Service',
      defaultFilterColumn: () => 'domain',
      header: /* @ngInject */ ($translate) =>
        $translate.instant('emails_mx_plan_title'),
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({ domain: productId }) =>
        $state.href('mxplan.dashboard', {
          productId,
        }),
      hideBreadcrumb: () => true,
    },
  });
};
