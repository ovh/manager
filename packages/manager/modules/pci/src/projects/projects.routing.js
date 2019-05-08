import controller from './projects.controller';
import template from './projects.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects', {
      abstract: true,
      url: '/projects',
      controller,
      controllerAs: '$ctrl',
      template,
    });
};
