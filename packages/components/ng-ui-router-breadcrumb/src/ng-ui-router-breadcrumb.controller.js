import punycode from 'punycode';

export default class BreadcrumbController {
  /* @ngInject */
  constructor(uiRouterBreadcrumbService) {
    this.uiRouterBreadcrumbService = uiRouterBreadcrumbService;

    this.breadcrumb = [];
  }

  $onInit() {
    this.uiRouterBreadcrumbService.subscribe((breadcrumb) => {
      this.breadcrumb = breadcrumb;
    });
    this.breadcrumb = this.uiRouterBreadcrumbService.getBreadcrumb();
  }

  static convertToPunycode(domain) {
    return punycode.toUnicode(domain);
  }
}
