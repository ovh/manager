import template from './octavia-load-balancer.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer', {
    url: '/pci/projects/{projectId:[0-9a-zA-Z]{32}}/octavia-load-balancer',
    template,
    redirectTo: 'octavia-load-balancer.onboarding',
    resolve: {
      projectId: /* @ngInject */ ($transition$) =>
        $transition$.params().projectId,
      project: /* @ngInject */ ($http, projectId) =>
        $http.get(`/cloud/project/${projectId}`).then(({ data }) => data),
      breadcrumb: ($translate) => $translate.instant('octavia_load_balancer'),
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
    },
  });
};
