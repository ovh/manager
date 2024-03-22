import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.zone.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'managerListLayout',
    params: ListLayoutHelper.stateParams,
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then(({ data }) =>
          data.length === 0 ? { state: 'app.zone.onboarding' } : false,
        ),
    resolve: {
      ...ListLayoutHelper.stateResolves,
      schema: /* @ngInject */ ($http) =>
        $http.get('/domain.json').then(({ data }) => data),
      apiPath: () => '/domain/zone',
      dataModel: () => 'domain.zone.Zone',
      defaultFilterColumn: () => 'name',
      header: /* @ngInject */ ($translate) => $translate.instant('zones_title'),
      customizableColumns: () => true,
      columns: /* @ngInject */ ($translate) => [
        {
          property: 'name',
          title: $translate.instant('zones_domain_name'),
          template: `<a data-ng-href="{{ $ctrl.getServiceNameLink($row) }}" data-ng-bind="$row.name"></a>`,
          searchable: true,
          sortable: 'asc',
          filterable: true,
        },
        {
          property: 'hasDnsAnycast',
          title: 'DNS Anycast',
          template: `<span data-ng-bind="$row.hasDnsAnycast ? '${$translate.instant(
            'zones_enabled',
          )}' : '${$translate.instant(
            'zones_disabled',
          )}'" class="oui-badge" ng-class="{'oui-badge_success': $row.hasDnsAnycast, 'oui-badge_error': !$row.hasDnsAnycast}"></span>
          `,
          searchable: true,
          sortable: true,
          filterable: true,
          type: 'boolean',
          typeOptions: {
            trueValue: $translate.instant('zones_enabled'),
            falseValue: $translate.instant('zones_disabled'),
          },
        },
        {
          property: 'dnssecSupported',
          title: 'DNSSEC',
          template: `<span data-ng-bind="$row.dnssecSupported ? '${$translate.instant(
            'zones_enabled',
          )}' : '${$translate.instant(
            'zones_disabled',
          )}'" class="oui-badge" ng-class="{'oui-badge_success': $row.dnssecSupported, 'oui-badge_error': !$row.dnssecSupported}"></span>
          `,
          searchable: true,
          sortable: true,
          filterable: true,
          type: 'boolean',
          typeOptions: {
            trueValue: $translate.instant('zones_enabled'),
            falseValue: $translate.instant('zones_disabled'),
          },
        },
      ],
      getServiceNameLink: /* @ngInject */ ($state) => ({ name: productId }) =>
        $state.href('app.zone.details', {
          productId,
        }),
      topbarOptions: /* @ngInject */ ($translate, $state, atInternet) => ({
        cta: {
          type: 'button',
          displayed: true,
          disabled: false,
          label: $translate.instant('zones_order'),
          value: $translate.instant('zones_order'),
          onClick: () => {
            atInternet.trackClick({
              name: 'web::zone::index::order',
              type: 'action',
            });
            $state.go('app.zone.new');
          },
        },
      }),
      hideBreadcrumb: () => true,
    },
  });
};
