export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.details.users', {
    url: '/users',
    reloadOnSearch: false,
    params: {
      trackingTag: null,
    },
    views: {
      pccView: 'dedicatedCloudUsers',
    },
    resolve: {
      tagPageParams: /* @ngInject */ (trackPage, $transition$) => {
        if ($transition$.params().trackingTag) {
          trackPage($transition$.params().trackingTag);
        }
      },
      goBack: /* @ngInject */ (goBackToState) => (
        message = false,
        type = 'success',
        reload = undefined,
      ) => {
        return goBackToState(
          'app.dedicatedCloud.details.users',
          message,
          type,
          reload,
        );
      },
      goBackWithTrackingPage: /* @ngInject */ (
        $state,
        $timeout,
        currentService,
        setMessage,
      ) => ({
        message = false,
        type = 'success',
        reload = undefined,
        trackingTag = null,
      }) => {
        const promise = $state.go(
          'app.dedicatedCloud.details.users',
          { productId: currentService.serviceName, trackingTag },
          {
            reload:
              reload === undefined ? message && type === 'success' : reload,
          },
        );

        if (message) {
          promise.then(() => $timeout(() => setMessage(message, type)));
        }

        return promise;
      },
      addUser: /* @ngInject */ ($state) => (passwordPolicy) =>
        $state.go('app.dedicatedCloud.details.users.add', {
          passwordPolicy,
        }),
      deleteUser: /* @ngInject */ ($state) => (user) =>
        $state.go('app.dedicatedCloud.details.users.delete', {
          userId: user.userId,
          user,
        }),
      disableUser: /* @ngInject */ ($state) => (user) =>
        $state.go('app.dedicatedCloud.details.users.user.disable', {
          userId: user.userId,
          user,
        }),
      editUser: /* @ngInject */ ($state) => (user) =>
        $state.go('app.dedicatedCloud.details.users.edit', {
          user,
          userId: user.userId,
        }),
      enableUser: /* @ngInject */ ($state) => (user) =>
        $state.go('app.dedicatedCloud.details.users.user.enable', {
          userId: user.userId,
          user,
        }),
      goToToggleIam: /* @ngInject */ ($state) => (iamToggleState) =>
        $state.go('app.dedicatedCloud.details.users.iam-toggle', {
          iamToggleState,
        }),
      goToUserIamRole: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedCloud.details.users.iam-role'),
      modifyUserRights: /* @ngInject */ ($state) => (userId) =>
        $state.go('app.dedicatedCloud.details.users.user.rights', {
          userId,
        }),
      passwordReset: /* @ngInject */ ($state) => (user, passwordPolicy) =>
        $state.go('app.dedicatedCloud.details.users.password-reset', {
          userId: user.userId,
          passwordPolicy,
          user,
        }),
      trackClick: /* @ngInject */ (atInternet) => (hit) =>
        atInternet.trackClick({
          name: `dedicated::dedicatedCloud::details::users::${hit}`,
          type: 'action',
        }),
      trackPage: /* @ngInject */ (atInternet) => (hit) =>
        atInternet.trackPage({
          name: `dedicated::dedicatedCloud::details::users::${hit}`,
        }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dedicated_cloud_users'),
    },
  });

  $stateProvider.state('app.dedicatedCloud.details.users.user', {
    url: '/:userId',
    redirectTo: 'app.dedicatedCloud.details.users',
    resolve: {
      userId: /* @ngInject */ ($transition$) => $transition$.params().userId,
      breadcrumb: /* @ngInject */ (userId) => userId,
    },
  });
};
