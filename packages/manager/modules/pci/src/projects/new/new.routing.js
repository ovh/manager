import template from './new.html';
import controller from './new.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.new', {
      url: '/new',
      template,
      controller,
      controllerAs: '$ctrl',
      translations: {
        format: 'json',
        value: ['.'],
      },
      resolve: {
        getCurrentStep: /* @ngInject */ $state => () => {
          if ($state.current.name === 'pci.projects.new') {
            return 'description';
          }

          return 'payment';
        },
        getStateLink: /* ngInject */ ($state, getCurrentStep) => (action) => {
          switch (action) {
            case 'cancel':
              return $state.href('pci.projects');
            case 'credits':
              return $state.href('pci.projects.new.payment', {
                type: action,
              });
            case 'payment':
              return $state.href('pci.projects.new.payment', {
                type: null,
              });
            default:
              if (getCurrentStep() === 'description') {
                return $state.href('pci.projects.new.payment');
              }

              return $state.href('pci.projects');
          }
        },
        newProjectModel: () => ({ // Resolve that share the info between sub states
          name: null,
          agreements: true,
          voucher: null,
        }),
      },
    });
};
