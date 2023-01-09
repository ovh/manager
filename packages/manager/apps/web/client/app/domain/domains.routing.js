import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { getDomainOrderUrl } from './domains.order';

const { stateParams } = ListLayoutHelper;
const { sortOrder } = stateParams;

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    views: {
      '': {
        component: 'managerListDomainLayout',
      },
    },
    params: {
      ...stateParams,
      sortOrder: {
        ...sortOrder,
        value: 'DESC',
      },
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.data.length === 0
            ? { state: 'app.domain.onboarding' }
            : false,
        ),
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/domain',
      dataModel: () => 'domain.Domain',
      defaultFilterColumn: () => 'domain',
      header: /* @ngInject */ ($translate) =>
        $translate.instant('domains_title'),
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({
        domain,
        parentService,
      }) =>
        parentService
          ? $state.href('app.alldom.domain', {
              allDom: parentService.name,
              productId: domain,
            })
          : $state.href('app.domain.product', {
              productId: domain,
            }),
      topbarOptions: /* @ngInject */ ($translate, $window, coreConfig) => ({
        cta: {
          type: 'button',
          displayed: true,
          disabled: false,
          label: $translate.instant('domains_order'),
          value: $translate.instant('domains_order'),
          onClick: () => {
            $window.open(
              getDomainOrderUrl(coreConfig.getUser().ovhSubsidiary),
              '_blank',
            );
          },
        },
      }),

      hideBreadcrumb: () => true,
    },
  });
};
