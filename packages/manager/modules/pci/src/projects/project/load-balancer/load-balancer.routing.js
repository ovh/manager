import map from 'lodash/map';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.loadbalancer', {
    url: '/load-balancer',
    component: 'pciProjectLoadBalancer',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('loadBalancers')
        .then((loadBalancers) =>
          loadBalancers.length === 0
            ? { state: 'pci.projects.project.loadbalancer.onboarding' }
            : false,
        ),
    resolve: {
      goToLoadBalancers: ($state, CucCloudMessage, projectId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const promise = $state.go(
          'pci.projects.project.loadbalancer',
          {
            projectId,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() => CucCloudMessage[type](message, 'load-balancer'));
        }
        return promise;
      },

      loadBalancers: /* @ngInject */ (PciLoadBalancerService, projectId) =>
        PciLoadBalancerService.getLoadBalancers(projectId).then((lbs) =>
          map(lbs, (id) => ({ id })),
        ),

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_load_balancer_list_title'),
    },
  });
};
