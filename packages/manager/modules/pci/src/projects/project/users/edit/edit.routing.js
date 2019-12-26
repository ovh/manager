import get from 'lodash/get';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.users.edit', {
    url: '/edit?userId',
    views: {
      modal: {
        component: 'pciProjectsProjectUsersRoles',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: /* @ngInject */ () => null,
      goBack: /* @ngInject */ (goToUsers) => goToUsers,
      rolesList: /* @ngInject */ (roles) => roles.roles,
      userId: /* @ngInject */ ($transition$) => $transition$.params().userId,
      userRoles: /* @ngInject */ (
        OvhApiCloudProjectUserRole,
        projectId,
        userId,
      ) =>
        OvhApiCloudProjectUserRole.v6().query({
          serviceName: projectId,
          userId,
        }).$promise,
      confirmRoles: /* @ngInject */ (
        $translate,
        goBack,
        OvhApiCloudProjectUserRole,
        projectId,
        userId,
      ) => (rolesIds) =>
        OvhApiCloudProjectUserRole.v6()
          .put(
            {
              serviceName: projectId,
              userId,
            },
            {
              rolesIds,
            },
          )
          .$promise.then(() =>
            goBack(
              $translate.instant(
                'pci_projects_project_users_roles_edit_success',
              ),
            ),
          )
          .catch((error) =>
            goBack(
              $translate.instant(
                'pci_projects_project_users_roles_edit_error',
                { message: get(error, 'data.message') },
              ),
              'error',
            ),
          ),
    },
  });
};
