import controller from './linediagnostic.controller';
import template from './linediagnostic.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.xdsl.line.line-diagnostic', {
    url: '/lineDiagnostic?type',
    views: {
      'accessView@telecom.packs.pack.xdsl.line': {
        template,
        controller,
        controllerAs: 'PackxdslaccesslinediagnosticCtrl',
      },
    },
  });
};
