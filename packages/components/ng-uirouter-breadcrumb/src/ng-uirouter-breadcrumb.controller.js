export default class BreadcrumbController {
  /* @ngInject */
  constructor(
    uirouterBreadcrumbService,
  ) {
    this.uirouterBreadcrumbService = uirouterBreadcrumbService;

    this.breadcrumb = [];
  }

  $onInit() {
    this.uirouterBreadcrumbService.subscribe((breadcrumb) => {
      this.breadcrumb = breadcrumb;
    });
    this.breadcrumb = this.uirouterBreadcrumbService.getBreadcrumb();
  }
}
