import controller from './project.controller';
import template from './project.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project', {
      url: '/{projectId}',
      controller,
      controllerAs: '$ctrl',
      template,
      translations: {
        format: 'json',
        value: ['.'],
      },
      resolve: {
        projectId: /* @ngInject */ $transition$ => $transition$.params().projectId,
      },
    });
};
