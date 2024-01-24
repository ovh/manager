import template from './octavia-load-balancer.html';
import {
  OPERATING_STATUS_BADGES,
  PROVISIONING_STATUS_BADGES,
} from './octavia-load-balancer.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer', {
    url: '/pci/projects/{projectId:[0-9a-zA-Z]{32}}/octavia-load-balancer',
    redirectTo: () => 'octavia-load-balancer.loadbalancers',
    template,
    resolve: {
      projectId: /* @ngInject */ ($transition$) =>
        $transition$.params().projectId,
      project: /* @ngInject */ ($http, projectId) =>
        $http.get(`/cloud/project/${projectId}`).then(({ data }) => data),
      apiSpecifications: /* @ngInject */ (OctaviaLoadBalancerService) =>
        OctaviaLoadBalancerService.getAPISpecifications(),
      goToListingPage: /* @ngInject */ ($state) => () =>
        $state.go('octavia-load-balancer.loadbalancers'),
      breadcrumb: ($translate) => $translate.instant('octavia_load_balancers'),
      breadcrumbPrefix: /* @ngInject */ (
        $injector,
        $q,
        coreURLBuilder,
        project,
      ) => {
        if ($injector.has('shellClient')) {
          return $injector
            .get('shellClient')
            .navigation.getURL(
              'public-cloud',
              `#/pci/projects/${project.project_id}`,
            )
            .then((url) => {
              return [
                {
                  name:
                    project.status !== 'creating' ? project.description : null,
                  url,
                },
              ];
            });
        }
        return $q.when([
          {
            name: project.status !== 'creating' ? project.description : null,
            url: coreURLBuilder.buildURL(
              'public-cloud',
              `#/pci/projects/${project.project_id}`,
            ),
          },
        ]);
      },
      displayErrorAlert: /* @ngInject */ (Alerter, $translate) => (
        error,
        alertSlot = 'octavia.alerts.global',
      ) => {
        Alerter.error(
          $translate.instant('octavia_load_balancer_global_error', {
            message: error.data?.message,
            requestId: error.headers('X-Ovh-Queryid'),
          }),
          alertSlot,
        );
      },
      operatingStatusBadges: () => OPERATING_STATUS_BADGES,
      provisioningStatusBadges: () => PROVISIONING_STATUS_BADGES,
    },
  });
};
