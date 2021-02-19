import controller from './resiliation.controller';
import template from './resiliation.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.xdsl.line.access-resiliation', {
    url: '/resiliation',
    views: {
      'accessView@telecom.packs.pack.xdsl.line': {
        template,
        controller,
        controllerAs: 'PackXdslResiliation',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('xdsl_resiliation_title'),
    },
  });
};
