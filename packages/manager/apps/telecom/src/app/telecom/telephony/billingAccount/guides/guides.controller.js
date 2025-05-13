import { GUIDES } from './guides.constants';

export default class TelecomTelephonyGuidesCtrl {
  /* @ngInject */
  constructor(SessionService) {
    this.SessionService = SessionService;
  }

  $onInit() {
    this.loading = {
      init: true,
    };
    this.guides = { sections: [] };

    this.SessionService.getUser().then(({ ovhSubsidiary }) => {
      this.language = ovhSubsidiary;

      this.guides = {
        sections: GUIDES.sections.reduce((sections, section) => {
          const filteredSection = {
            ...section,
            guides: section.guides
              .filter((guide) => guide.url[ovhSubsidiary])
              .map((guide) => ({
                ...guide,
                url: guide.url[ovhSubsidiary],
              })),
          };

          if (filteredSection.guides.length > 0) {
            return [...sections, filteredSection];
          }
          return sections;
        }, []),
      };

      this.loading.init = false;
    });
  }

  /**
   * Has guides helper.
   * @return {Boolean}
   */
  hasGuides() {
    return this.guides.sections.length > 0;
  }
}
