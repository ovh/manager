import get from 'lodash/get';

export default class PciUsersOpenstackTokenController {
  /* @ngInject */
  constructor($translate, PciProjectsProjectUsersService) {
    this.$translate = $translate;
    this.PciProjectsProjectUsersService = PciProjectsProjectUsersService;
  }

  $onInit() {
    this.isLoading = false;
    this.user = {
      id: this.userId,
      password: null,
      username: this.user.username,
    };
    this.token = null;
  }

  generateToken() {
    this.isLoading = true;
    return this.PciProjectsProjectUsersService.generateToken(
      this.projectId,
      this.user,
    )
      .then((response) => {
        this.authToken = get(response, 'X-Auth-Token');
        this.token = get(response, 'token');
      })
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_users_openstack-token_error_save',
            {
              message: get(err, 'data.message', null),
              user: this.user.username,
            },
          ),
          'error',
        ),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }
}
