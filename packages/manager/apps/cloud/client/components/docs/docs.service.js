import get from 'lodash/get';
import map from 'lodash/map';
import set from 'lodash/set';

import { Environment } from '@ovh-ux/manager-config';

class DocsService {
  /* @ngInject */
  constructor($translate, coreConfig, DOCS_ALL_GUIDES, DOCS_HOMEPAGE_GUIDES) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.DOCS_ALL_GUIDES = DOCS_ALL_GUIDES;
    this.DOCS_HOMEPAGE_GUIDES = DOCS_HOMEPAGE_GUIDES;
  }

  getDomainOfGuides() {
    if (this.coreConfig.getRegion() === 'US') {
      return 'US';
    }

    if (Environment.getUserLanguage().toUpperCase() === 'FR') {
      return 'FR';
    }
    return 'EN';
  }

  getAllGuidesLink() {
    const userLocale = Environment.getUserLocale().toUpperCase();
    const domain = this.getDomainOfGuides();

    return get(
      this.DOCS_ALL_GUIDES,
      userLocale,
      get(this.DOCS_ALL_GUIDES, domain, this.DOCS_ALL_GUIDES.EN),
    );
  }

  getGuidesOfSection(section) {
    const userLocale = Environment.getUserLocale().toUpperCase();
    const domain = this.getDomainOfGuides();

    const sectionContent = get(
      this.DOCS_HOMEPAGE_GUIDES,
      `${userLocale}.${section}`,
      this.DOCS_HOMEPAGE_GUIDES[domain][section],
    );

    sectionContent.list = map(sectionContent.list, (guide) => {
      set(guide, 'text', this.$translate.instant(guide.text));
      return guide;
    });

    return sectionContent;
  }
}

angular.module('managerApp').service('DocsService', DocsService);
