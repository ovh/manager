import {
  DEFAULT_GUIDE_LANGUAGE,
  GUIDE_LANGUAGES,
  GUIDE_URL_TEMPLATE,
  TRACKING_HITS,
} from './constants';

export default class LegacyAccessNoticeCtrl {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  $onInit() {
    // The guide hub is published per language, so the displayed locale is what
    // selects it — its primary subtag, degrading to English for anything the
    // hub does not publish, so the link always has a destination.
    const [language] = (this.$translate.use() || '')
      .toLowerCase()
      .split(/[-_]/);
    this.guideUrl = GUIDE_URL_TEMPLATE.replace(
      '{{lang}}',
      GUIDE_LANGUAGES.includes(language) ? language : DEFAULT_GUIDE_LANGUAGE,
    );
    // '&?' leaves the binding undefined when the attribute is absent, which is
    // how a surface says it has no enable-IAM action of its own to offer.
    this.hasEnableIamAction = !!this.onEnableIam;
    // One signal, two messages: the notice can never outlive the controls it
    // announces.
    const state = this.legacyAccess?.isDecommissioned ? 'after' : 'before';
    this.titleKey = `logs_legacy_access_${state}_title`;
    this.descriptionKey = `logs_legacy_access_${state}_description`;
  }

  enableIam() {
    this.trackClick(TRACKING_HITS.ENABLE_IAM);
    return this.onEnableIam();
  }

  goToRoles() {
    this.trackClick(TRACKING_HITS.ENABLE_IAM);
  }

  goToGuide() {
    this.trackClick(TRACKING_HITS.GUIDE);
  }
}
