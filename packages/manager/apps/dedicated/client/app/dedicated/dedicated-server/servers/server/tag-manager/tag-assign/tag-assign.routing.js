import { TRACKING } from '../tag-manager.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-server.server.dashboard.tag-manager.assign',
    {
      url: '/assign',
      views: {
        modal: {
          component: 'ovhManagerResourceTaggingAssignModal',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        resourceUrn: /* @ngInject */ (server) => server?.iam?.urn,
        goBack: /* @ngInject */ (goToTagManager) => (reload = false) => {
          return goToTagManager(reload);
        },
        trackingPrefix: () => TRACKING.PREFIX,
        trackingPage: () => TRACKING.PAGE.ASSIGN_TAG,
      },
      atInternet: {
        rename: `${TRACKING.PREFIX}${TRACKING.PAGE.ASSIGN_TAG}`,
      },
    },
  );
};
