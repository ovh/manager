import controller from './imports.controller';
import template from './imports.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.failover-ips.imports', {
    url: '/imports',
    controller,
    controllerAs: '$ctrl',
    template,
    translations: {
      format: 'json',
      value: ['.'],
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate
          .refresh()
          .then(() =>
            $translate.instant('pci_projects_project_failoverip_imports_title'),
          ),
    },
  });
};
