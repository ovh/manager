import get from 'lodash/get';
import map from 'lodash/map';

export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('pci.projects.project.users.add.roles', {
    url: '/roles?description',
    views: {
      modal: {
        component: 'pciProjectsProjectUsersRoles',
      },
    },
    layout: {
      name: 'modal',
      redirectTo: 'pci.projects.project.users',
    },
    resolve: {
      breadcrumb: /* @ngInject */ () => null,
      rolesList: /* @ngInject */ (roles) => map(
        roles.roles,
        ({ name, description }) => ({ id: name, name, description }),
      ),
      goBack: /* @ngInject */ (goToUsers) => goToUsers,
      description: /* @ngInject */ ($transition$) => $transition$.params().description,
      confirmRoles: /* @ngInject */ (
        $translate,
        description,
        goBack,
        PciProjectsProjectUsersService,
        projectId,
      ) => (roles) => PciProjectsProjectUsersService.add(projectId, { description }, roles)
        .then(({ username, password }) => goBack({
          textHtml: $translate.instant(
            'pci_projects_project_users_add_success_message',
            {
              username,
              password,
            },
          ),
        }))
        .catch((err) => goBack($translate.instant(
          'pci_projects_project_users_add_error_save',
          {
            message: get(err, 'data.message', null),
          },
        ), 'error')),
    },
  });
};
