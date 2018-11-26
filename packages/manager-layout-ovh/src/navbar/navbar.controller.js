export default class NavbarController {
  constructor($rootScope, ManagerNavbarService) {
    'ngInject';

    this.$rootScope = $rootScope;
    this.ManagerNavbarService = ManagerNavbarService;

    this.togglerActive = false;
    this.togglerLoading = true;
  }

  $onInit() {
    this.ManagerNavbarService.getNavbar()
      .then(({ brand, managerLinks, internalLinks }) => {
        this.brand = brand;
        this.managerLinks = managerLinks;
        this.internalLinks = internalLinks;
      });

    this.$rootScope.$on('sidebar:loaded', () => {
      this.togglerLoading = false;
    });
  }

  toggleSidebar() {
    this.togglerActive = !this.togglerActive;
    this.$rootScope.$broadcast('navbar:toggle');
  }
}
