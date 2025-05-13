import controller from './dmz.controller';
import template from './dmz.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.xdsl.line.modem.dmz', {
    url: '/dmz',
    views: {
      'modemView@telecom.packs.pack.xdsl.line.modem': {
        template,
        controller,
        controllerAs: 'DmzCtrl',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('xdsl_modem_dmz_status'),
    },
  });
};
