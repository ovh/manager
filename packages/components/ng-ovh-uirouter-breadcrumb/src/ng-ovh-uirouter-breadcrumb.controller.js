export default class ngUirouterBreadcrumbController {
  /* @ngInject */
  constructor(
    ngOvhUirouterBreadcrumbService,
  ) {
    this.ngOvhUirouterBreadcrumbService = ngOvhUirouterBreadcrumbService;

    this.breadcrumb = [];
  }

  $onInit() {
    this.ngOvhUirouterBreadcrumbService.subscribe((breadcrumb) => {
      this.breadcrumb = breadcrumb;
    });
    this.breadcrumb = this.ngOvhUirouterBreadcrumbService.getBreadcrumb();
  }
}
