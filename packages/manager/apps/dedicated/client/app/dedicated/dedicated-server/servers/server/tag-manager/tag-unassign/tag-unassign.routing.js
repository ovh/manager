import { TRACKING } from '../tag-manager.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-server.server.dashboard.tag-manager.unassign',
    {
      url: '/unassign',
      views: {
        modal: {
          component: 'ovhManagerResourceTaggingUnassignModal',
        },
      },
      params: {
        tags: {
          array: true,
          value: [],
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        resourceUrn: /* @ngInject */ (server) => server?.iam?.urn,
        resourceName: /* @ngInject */ (server) => server?.iam?.displayName,
        tagsToRemove: /* @ngInject */ ($transition$) =>
          $transition$.params().tags,
        goBack: /* @ngInject */ (goToTagManager) => (reload = false) => {
          return goToTagManager(reload);
        },
        trackingPrefix: () => TRACKING.PREFIX,
        trackingPage: () => TRACKING.PAGE.UNASSIGN_TAG,
      },
      atInternet: {
        rename: `${TRACKING.PREFIX}${TRACKING.PAGE.UNASSIGN_TAG}`,
      },
    },
  );
};
