import controller from './deconsolidation.controller';
import template from './deconsolidation.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.xdsl.line.access-deconsolidation', {
    url: '/deconsolidation',
    views: {
      'accessView@telecom.packs.pack.xdsl.line': {
        controller,
        controllerAs: 'DeconCtrl',
        template,
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('xdsl_access_deconsolidation_title'),
    },
  });
};
