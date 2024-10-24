import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { getHostingOrderUrl } from './hosting.order';
import { NEW_OFFERS_NAME } from './hosting.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'managerListLayout',
    params: ListLayoutHelper.stateParams,
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('noFiltersHosting')
        .then((noFiltersHosting) =>
          noFiltersHosting.data.length === 0
            ? { state: 'app.hosting.onboarding' }
            : false,
        ),
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/hosting/web',
      dataModel: () => 'hosting.web.Service',
      noFiltersHosting: /* @ngInject */ ($http) => $http.get('/hosting/web'),
      loadResource: /* @ngInject */ ($translate) => (resource) => {
        const offerPrefix = NEW_OFFERS_NAME[resource.offer];
        const offerName = offerPrefix
          ? $translate.instant(`hostings_offer_${offerPrefix}`)
          : resource.offer;

        return {
          ...resource,
          offer: offerName,
        };
      },
      defaultFilterColumn: () => 'serviceName',
      header: /* @ngInject */ ($translate) =>
        $translate.instant('hostings_title'),
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({
        serviceName: productId,
      }) =>
        $state.href('app.hosting.dashboard', {
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
          label: $translate.instant('hostings_order'),
          value: $translate.instant('hostings_order'),
          onClick: () => {
            atInternet.trackClick({
              name: 'web::hosting::index::order',
              type: 'action',
            });
            $window.open(
              getHostingOrderUrl(coreConfig.getUser().ovhSubsidiary),
              '_blank',
            );
          },
        },
      }),
      hideBreadcrumb: () => true,
    },
  });
};
