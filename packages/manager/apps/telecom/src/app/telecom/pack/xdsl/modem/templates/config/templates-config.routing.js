import controller from './templates-config.controller';
import template from './templates-config.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.xdsl.line.modem.templates', {
    url: '/template',
    views: {
      'modemView@telecom.packs.pack.xdsl.line.modem': {
        template,
        controller,
        controllerAs: '$ctrl',
      },
    },
    params: {
      templates: null,
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('xdsl_modem_template_config_breadcrumb'),
    },
  });
};
