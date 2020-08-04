export default class BreadcrumbController {
  /* @ngInject */
  constructor(uiRouterBreadcrumbService) {
    this.uiRouterBreadcrumbService = uiRouterBreadcrumbService;

    this.breadcrumb = [];
  }

  $onInit() {
    this.uiRouterBreadcrumbService.subscribe(() => {
      this.updateBreadcrumb();
    });
  }

  updateBreadcrumb() {
    this.breadcrumb = this.uiRouterBreadcrumbService.getBreadcrumb();
    document.querySelector('#manager-breadcrumb').elements = this.breadcrumb;
  }
}
