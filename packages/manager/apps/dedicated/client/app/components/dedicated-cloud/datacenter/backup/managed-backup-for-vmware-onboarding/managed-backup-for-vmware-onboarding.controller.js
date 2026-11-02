import {
  LAUNCH_OFFER_WINDOW,
  ONBOARDING_GUIDES,
  TRANSLATION_PREFIX,
} from './managed-backup-for-vmware-onboarding.constants';

import ILLUSTRATION from './assets/managed-backup-for-vmware.svg';

const parisDayOf = (now) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Paris',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(now));

/** Whether an order placed now gets the launch offer — the day, in Paris. */
export const isLaunchOfferRunning = (now = Date.now()) => {
  const day = parisDayOf(now);
  return day >= LAUNCH_OFFER_WINDOW.from && day <= LAUNCH_OFFER_WINDOW.to;
};

/** `28 February 2027` in the user's language, as the MBV app writes it. */
export const formatLongDate = (isoDay, language) =>
  new Intl.DateTimeFormat(language.replace('_', '-'), {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(isoDay));

/** The guides are written in French and in English only. */
export const guideLanguage = (language) =>
  language.startsWith('fr') ? 'fr' : 'en';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
    this.illustration = ILLUSTRATION;
    this.TRANSLATION_PREFIX = TRANSLATION_PREFIX;
  }

  $onInit() {
    const language = this.$translate.use() || 'en_GB';

    this.isLaunchOfferRunning = isLaunchOfferRunning();
    this.launchOfferEnd = formatLongDate(LAUNCH_OFFER_WINDOW.to, language);

    this.guides = ONBOARDING_GUIDES.map(({ id, url }) => ({
      id,
      link: url[guideLanguage(language)],
      category: this.$translate.instant(`${TRANSLATION_PREFIX}_guide_badge`),
      title: this.$translate.instant(`${TRANSLATION_PREFIX}_guide_${id}_title`),
      description: this.$translate.instant(
        `${TRANSLATION_PREFIX}_guide_${id}_description`,
      ),
    }));
  }
}
