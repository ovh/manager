import controller from './orderFollowUp.controller';
import template from './orderFollowUp.html';
// import mainViewTemplate from './orderFollowUp-main.view.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.information.order-follow-up', {
    url: '/order-follow-up',
    views: {
      'packView@telecom.packs': {
        template,
        controller: 'XdslOrderFollowUpCtrl',
        controllerAs: controller,
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('telecom_pack_xdsl_order_follow_up_intro'),
    },
  });
};
