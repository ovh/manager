import controller from './project.controller';
import template from './project.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project', {
    url: '/{projectId:[0-9a-zA-Z]{32}}',
    views: {
      '@pci': {
        controller,
        controllerAs: '$ctrl',
        template,
      },
    },
    redirectTo: (transition) => {
      const projectPromise = transition.injector().getAsync('project');
      return projectPromise.then((project) => {
        if (project.status === 'creating') {
          // for specifying options of redirectTo attribute
          // we need to return a TargetState which is accessible
          // through router.stateService.target of transition object
          return transition.router.stateService.target(
            'pci.projects.project.creating',
            transition.params(),
            {
              location: false,
            },
          );
        }

        return null;
      });
    },
    resolve: {
      projectId: /* @ngInject */ ($transition$) =>
        $transition$.params().projectId,
      project: /* @ngInject */ (OvhApiCloudProject, projectId) =>
        OvhApiCloudProject.v6().get({
          serviceName: projectId,
        }).$promise,
      breadcrumb: /* @ngInject */ (project) =>
        project.status !== 'creating' ? project.description : null,
      sidebarVisible: /* @ngInject */ (project) =>
        project.status !== 'creating',
      user: /* @ngInject */ (SessionService) => SessionService.getUser(),
    },
  });
};
