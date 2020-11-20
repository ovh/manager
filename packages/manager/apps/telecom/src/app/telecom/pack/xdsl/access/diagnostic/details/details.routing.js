import controller from './details.controller';
import template from './details.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.packs.pack.xdsl.line.access-diagnostic-details',
    {
      url: '/diagnostic-details',
      template,
      controller,
      controllerAs: '$ctrl',
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
      },
    },
  );
};
