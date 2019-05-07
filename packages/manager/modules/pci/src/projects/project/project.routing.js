import controller from './project.controller';
import template from './project.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project', {
      url: '/{projectId:[0-9a-zA-Z]{32}}',
      views: {
        '@pci': {
          controller,
          controllerAs: '$ctrl',
          template,
        },
      },
      redirectTo: ($transitions) => {
        const projectPromise = $transitions.injector().getAsync('project');
        return projectPromise
          .then((project) => {
            if (project.status === 'creating') {
              return 'pci.projects.project.creating';
            }

            return null;
          });
      },
      resolve: {
        projectId: /* @ngInject */  $transition$ => $transition$.params().projectId,
        project: /* @ngInject */ (OvhApiCloudProject, $transition$) => OvhApiCloudProject
          .v6()
          .get({
            serviceName: $transition$.params().projectId,
          })
          .$promise,
        breadcrumb: /* @ngInject */ project => project.description,
      },
    });
};
