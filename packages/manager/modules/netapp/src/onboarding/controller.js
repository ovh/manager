import { URLS } from '@ovh-ux/manager-core';

import { GUIDES } from './constants';
import illustration from './assets/netapp_onboarding.png';

export default class OvhManagerNetAppOnboardingCtrl {
  /* @ngInject */
  constructor($translate, coreConfig) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
  }

  $onInit() {
    const { ovhSubsidiary } = this.coreConfig.getUser();
    this.illustration = illustration;
    this.storageGuide = {
      hitName: 'storage',
      link: URLS.guides.storage[ovhSubsidiary] || URLS.guides.storage.default,
    };
    this.supportLevel = {
      hitName: 'go-to-subscribe-support-levels',
      link: URLS.support_level[ovhSubsidiary] || URLS.support_level.default,
    };
    const guides = GUIDES.reduce(
      (guideList, guide) => [
        ...guideList,
        {
          ...guide,
          description: this.$translate.instant(
            `netapp_onboarding_${guide.id}_description`,
          ),
          link: guide.link[ovhSubsidiary] || guide.link.default,
          title: this.$translate.instant(`netapp_onboarding_${guide.id}_title`),
        },
      ],
      [],
    );

    this.volumeGuides = guides.filter(({ id }) => id.includes('volume'));
    this.highlightedGuides = guides.filter(({ highlight }) => highlight);
  }

  onOrderClick() {
    this.trackClick('order');
    return this.goToOrder();
  }
}
