import controller from './detail.controller';
import template from './detail.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.emailPro-detail', {
    url: '/xdsl-email/:serviceName/detail',
    template,
    controller,
    controllerAs: '$ctrl',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('email_pro_detail_breadcrumb'),
    },
  });
};
