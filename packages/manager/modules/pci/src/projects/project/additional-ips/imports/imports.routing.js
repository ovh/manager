import controller from './imports.controller';
import template from './imports.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.additional-ips.imports', {
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
            $translate.instant('pci_additional_ips_failoverip_imports_title'),
          ),
    },
  });
};
