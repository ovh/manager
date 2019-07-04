import map from 'lodash/map';

import controller from './projects.controller';
import template from './projects.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects', {
      url: '/projects',
      controller,
      controllerAs: '$ctrl',
      template,
      redirectTo: (transition) => {
        const projectsPromise = transition.injector().getAsync('projects');
        return projectsPromise
          .then((projects) => {
            if (!projects.length) {
              return 'pci.projects.onboarding';
            }

            return true;
          });
      },
      resolve: {
        breadcrumb: /* @ngInject */ () => null,
        projects: /* @ngInject */ OvhApiCloudProject => OvhApiCloudProject
          .v6()
          .query()
          .$promise
          .then(projects => map(projects, serviceName => ({ serviceName }))),
      },
    });
};
