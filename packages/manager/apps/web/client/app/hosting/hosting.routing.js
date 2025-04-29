import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { getHostingOrderUrl } from './hosting.order';
import { NEW_OFFERS_NAME, HOSTING_GUIDES } from './hosting.constants';

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
      columnConfig: /* @ngInject */ ($translate) => ({
        data: [
          {
            label: $translate.instant('hosting_databgrid_column_service_name'),
            property: 'serviceName',
            serviceLink: true,
            hidden: false,
          },
          {
            label: $translate.instant('hosting_databgrid_column_offer'),
            property: 'offer',
            hidden: false,
          },
          {
            label: $translate.instant('hosting_databgrid_column_state'),
            property: 'state',
            hidden: false,
          },
          {
            label: $translate.instant('hosting_databgrid_column_resource_type'),
            property: 'resourceType',
            hidden: false,
          },
          {
            label: $translate.instant('hosting_databgrid_column_datacenter'),
            property: 'datacenter',
            hidden: false,
          },
          {
            label: $translate.instant('hosting_databgrid_column_display_name'),
            property: 'displayName',
            hidden: false,
          },
        ],
      }),
      description: /* @ngInject */ ($translate) =>
        $translate.instant('hosting_datagrid_description'),
      header: /* @ngInject */ ($translate) =>
        $translate.instant('hostings_title'),
      changelog: () => 'hosting_plan',
      guides: /* @ngInject */ ($translate, coreConfig) =>
        HOSTING_GUIDES.map((guide) => ({
          title: $translate.instant(guide.translateKey),
          href:
            guide.url[coreConfig.getUser().ovhSubsidiary] || guide.url.DEFAULT,
        })),
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({
        serviceName: productId,
      }) =>
        $state.href('app.hosting.dashboard', {
          productId,
        }),
      goDatabaseSelector: /* @ngInject */ (coreURLBuilder) =>
        coreURLBuilder.buildURL('web', `#/hosting/database-selector`),
      topbarOptions: /* @ngInject */ (
        $translate,
        $window,
        coreConfig,
        atInternet,
        goDatabaseSelector,
      ) => ({
        cta: {
          type: 'actions',
          displayed: true,
          disabled: false,
          menuText: $translate.instant('hostings_order'),
          actions: [
            {
              id: 'first-action-item',
              displayed: true,
              disabled: false,
              label: $translate.instant('hostings_order_hosting'),
              value: $translate.instant('hostings_order_hosting'),
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
            {
              id: 'second-action-item',
              displayed: true,
              disabled: false,
              label: $translate.instant('hostings_order_sql'),
              value: $translate.instant('hostings_order_sql'),
              onClick: () => {
                $window.open(goDatabaseSelector, '_self');
              },
            },
          ],
        },
      }),
      hideBreadcrumb: () => true,
    },
  });
};
