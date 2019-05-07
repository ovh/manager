import get from 'lodash/get';

export default class PciUsersAddController {
  /* @ngInject */
  constructor(
    $translate,
    PciProjectsProjectUsersService,
  ) {
    this.$translate = $translate;
    this.PciProjectsProjectUsersService = PciProjectsProjectUsersService;
  }

  $onInit() {
    this.user = {};
    this.isLoading = false;
  }

  addUser() {
    this.isLoading = true;
    return this.PciProjectsProjectUsersService.add(this.projectId, this.user)
      .then(({ username, password }) => this.goBack({
        textHtml: this.$translate.instant(
          'pci_projects_project_users_add_success_message',
          {
            username,
            password,
          },
        ),
      }))
      .catch(err => this.goBack(this.$translate.instant(
        'pci_projects_project_users_add_error_save',
        {
          message: get(err, 'data.message', null),
        },
      ), 'error'))
      .finally(() => {
        this.isLoading = false;
      });
  }
}
