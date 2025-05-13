import { GUIDES_DEDICATED_CLOUD } from './dedicatedCloud-guides.constants';

export default class {
  /* @ngInject */
  constructor(coreConfig) {
    this.coreConfig = coreConfig;
  }

  $onInit() {
    const user = this.coreConfig.getUser();
    this.guides = Object.keys(GUIDES_DEDICATED_CLOUD).map((guideKey) => {
      const guide = GUIDES_DEDICATED_CLOUD[guideKey];
      return {
        key: guideKey,
        url: guide[user?.ovhSubsidiary] || guide.GB,
      };
    });
  }
}
