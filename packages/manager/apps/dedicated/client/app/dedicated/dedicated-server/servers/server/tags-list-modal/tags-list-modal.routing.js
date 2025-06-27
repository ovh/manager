import { TRACKING } from './tags-list-modal.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-server.server.dashboard.tags-list-modal',
    {
      url: '/tags',
      views: {
        modal: {
          component: 'ovhManagerResourceTaggingListModal',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        resourceName: /* @ngInject */ (serverName) => serverName,
        cancel: /* @ngInject */ (goToServerDetails) => () => {
          goToServerDetails();
        },
        tags: /* @ngInject */ (server) => server.iam?.tags,
      },
      atInternet: {
        rename: `${TRACKING.PREFIX}${TRACKING.PAGE.ALL_TAGS}`,
      },
    },
  );
};
