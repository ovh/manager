import { GUIDE } from '@iam/constants';

export default class GuideService {
  /* @ngInject */
  constructor($translate, coreConfig) {
    this.$translate = $translate;
    this.ovhSubsidiary = coreConfig.getUser().ovhSubsidiary;
    this.guideEntries = Object.entries(GUIDE);
  }

  /**
   * Format the given list of guides based on the current user's subsidiary
   * for direct use in templates
   * @param {GUIDE[]} guides A list of GUIDE constants
   * @returns {{ key: string, link: string, title: string, description: string }[]}
   */
  formatGuides(...guides) {
    return this.guideEntries
      .filter(([, guide]) => guides.includes(guide))
      .map(([key, guide]) => {
        const lowerKey = key.toLowerCase();
        return {
          key: lowerKey,
          link: guide[this.ovhSubsidiary] ?? guide.DEFAULT,
          title: this.$translate.instant(`iam_services_guide_${lowerKey}`),
          description: this.$translate.instant(
            `iam_services_guide_description_${lowerKey}`,
          ),
          // TODO augment with tracking data
        };
      });
  }
}
