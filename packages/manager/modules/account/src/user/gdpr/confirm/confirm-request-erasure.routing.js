import {
  TRACKING_CONFIRM_PAGE_CATEGORY,
  TRACKING_CONFIRM_PAGE,
} from '../gdpr.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('account.user.gdpr.confirm', {
    url: '/:publicId/confirm-request-erasure',
    component: 'gdprFeaturesConfirm',
    resolve: {
      publicId: /* @ngInject */ ($transition$) =>
        $transition$.params().publicId,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('gdpr_erasure_confirm_title'),
    },
    atInternet: {
      ignore: true,
    },
    onEnter: /* @ngInject */ (atInternet) => {
      atInternet.trackPage({
        name: TRACKING_CONFIRM_PAGE,
        page_category: TRACKING_CONFIRM_PAGE_CATEGORY,
      });
    },
  });
};
