export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.order-follow-up', {
    url: '/order-follow-up?packName',
    views: {
      '@telecom.packs': 'orderFollowUp',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('telecom_pack_xdsl_order_follow_up_intro'),
    },
  });
};
