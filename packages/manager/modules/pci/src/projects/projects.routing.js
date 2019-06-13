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
      resolve: {
        projects: /* @ngInject */ OvhApiCloudProject => OvhApiCloudProject
          .v6()
          .query()
          .$promise
          .then(projects => map(projects, serviceName => ({ serviceName }))),
      },
    });
};
