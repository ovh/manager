import controller from './diagnostic.controller';
import template from './diagnostic.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.xdsl.line.access-diagnostic', {
    url: '/diagnostic',
    views: {
      'accessView@telecom.packs.pack.xdsl.line': {
        controller,
        controllerAs: '$ctrl',
        template,
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pack_xdsl_access_diagnostic_title'),
    },
  });
};
