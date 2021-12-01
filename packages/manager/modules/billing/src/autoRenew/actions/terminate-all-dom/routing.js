import map from 'lodash/map';
import get from 'lodash/get';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.terminate-all-dom', {
    url: '/delete-all-dom?serviceId&serviceType',
    views: {
      modal: {
        component: 'billingAutorenewTerminateAllDom',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToAutorenew) => goToAutorenew,
      serviceId: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceId,
      serviceType: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceType,
      domains: /* @ngInject */ ($http, $q, $translate, serviceId) =>
        $http.get(`/allDom/${serviceId}/domain`).then(({ data: domains }) => {
          const promises = domains.map((domain) =>
            $http.get(`/domain/${domain}/serviceInfos`),
          );
          promises.push($http.get(`/allDom/${serviceId}/serviceInfos`));
          return $q.all(promises).then((serviceInfos) => {
            // serviceInfos array contains the serviceInfo of each domain at the same index and the serviceInfo of allDom as the last element
            const allDomExpiration = get(
              serviceInfos[serviceInfos.length - 1],
              'data.expiration',
            );
            return map(domains, (domain, index) => {
              return {
                name: domain,
                selected: false,
                tooltip: moment(
                  get(serviceInfos[index], 'data.expiration'),
                ).isAfter(allDomExpiration)
                  ? $translate.instant(
                      'autorenew_all_dom_domain_free_if_renewed',
                      {
                        allDom: serviceId,
                        allDomExpiration,
                      },
                    )
                  : $translate.instant('autorenew_all_dom_domain_free'),
              };
            });
          });
        }),
      breadcrumb: () => null,
    },
  });
};
