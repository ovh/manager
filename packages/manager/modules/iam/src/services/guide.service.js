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
   * @returns {{ key: string, url: string, text: string }[]}
   */
  formatGuides(...guides) {
    return this.guideEntries
      .filter(([, guide]) => guides.includes(guide))
      .map(([key, guide]) => {
        const lowerKey = key.toLowerCase();
        return {
          key: lowerKey,
          url: guide[this.ovhSubsidiary] ?? guide.DEFAULT,
          text: this.$translate.instant(`iam_services_guide_${lowerKey}`),
          // TODO augment with tracking data
        };
      });
  }
}
