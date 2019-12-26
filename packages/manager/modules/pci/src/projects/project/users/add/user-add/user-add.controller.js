export default class PciUsersAddController {
  /* @ngInject */
  constructor($translate, PciProjectsProjectUsersService) {
    this.$translate = $translate;
    this.PciProjectsProjectUsersService = PciProjectsProjectUsersService;
  }

  $onInit() {
    this.user = {};
    this.isLoading = false;
  }
}
