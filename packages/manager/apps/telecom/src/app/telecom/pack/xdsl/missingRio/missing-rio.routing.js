import controller from './missing-rio.controller';
import template from './missing-rio.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.xdsl.line.missing-rio', {
    url: '/missingRio',
    views: {
      'accessView@telecom.packs.pack.xdsl.line': {
        template,
        controller,
        controllerAs: 'PackXdslMissingRio',
      },
    },
  });
};
