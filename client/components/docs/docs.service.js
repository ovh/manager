class DocsService {
  constructor($translate, TranslateService, coreConfig, DOCS_ALL_GUIDES, DOCS_HOMEPAGE_GUIDES) {
    this.$translate = $translate;
    this.TranslateService = TranslateService;
    this.coreConfig = coreConfig;
    this.DOCS_ALL_GUIDES = DOCS_ALL_GUIDES;
    this.DOCS_HOMEPAGE_GUIDES = DOCS_HOMEPAGE_GUIDES;
  }

  getDomainOfGuides() {
    if (this.coreConfig.getRegion() === 'US') {
      return 'US';
    }
    const locale = this.TranslateService.getGeneralLanguage();

    if (locale === 'fr') {
      return 'FR';
    }
    return 'EN';
  }

  getAllGuidesLink() {
    const userLocale = this.TranslateService.getUserLocale().toUpperCase();
    const domain = this.getDomainOfGuides();

    return _.get(
      this.DOCS_ALL_GUIDES,
      userLocale,
      _.get(this.DOCS_ALL_GUIDES, domain, this.DOCS_ALL_GUIDES.EN),
    );
  }

  getGuidesOfSection(section) {
    const userLocale = this.TranslateService.getUserLocale().toUpperCase();
    const domain = this.getDomainOfGuides();

    const sectionContent = _.get(this.DOCS_HOMEPAGE_GUIDES, `${userLocale}.${section}`, this.DOCS_HOMEPAGE_GUIDES[domain][section]);

    sectionContent.list = _.map(sectionContent.list, (guide) => {
      _.set(guide, 'text', this.$translate.instant(guide.text));
      return guide;
    });

    return sectionContent;
  }
}

angular.module('managerApp').service('DocsService', DocsService);
