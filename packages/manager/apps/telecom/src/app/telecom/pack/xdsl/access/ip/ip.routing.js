import controller from './ip.controller';
import template from './ip.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.xdsl.line.access-ip', {
    url: '/ip/:block',
    views: {
      'accessView@telecom.packs.pack.xdsl.line': {
        controller,
        controllerAs: 'XdslAccessIp',
        template,
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pack_xdsl_access_ip_title'),
    },
  });
};
