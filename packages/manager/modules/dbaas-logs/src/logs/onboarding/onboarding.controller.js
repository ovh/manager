import { GUIDES } from './onboarding.constants';
import illustration from './assets/LDP-Overview-hero@2x.png';

export default class LogsOnboardingCtrl {
  /* @ngInject */
  constructor(
    LogsConstants,
    CucOrderHelperService,
    ovhDocUrl,
    coreConfig,
    $translate,
    atInternet,
  ) {
    this.$translate = $translate;
    this.illustration = illustration;
    this.atInternet = atInternet;
    this.region = coreConfig.getRegion();
    this.LogsConstants = LogsConstants;
    this.CucOrderHelperService = CucOrderHelperService;
    this.ovhDocUrl = ovhDocUrl;
    this.urls = {};
  }

  $onInit() {
    this.guides = GUIDES.reduce(
      (list, guide) => [
        ...list,
        {
          ...guide,
          title: this.$translate.instant(
            `logs_onboarding_guides_${guide.id}_title`,
          ),
          description: '',
        },
      ],
      [],
    );

    this.urls.docsUrl = this.ovhDocUrl.getDocUrl(
      this.LogsConstants.LOGS_DOCS_NAME,
    );
  }

  onGuideClick(guide) {
    this.atInternet.trackClick({
      name: guide.tracker,
      type: 'action',
    });
  }

  onSubmitClick() {
    this.atInternet.trackClick({
      name: 'dbaas::logs::onboarding::order',
      type: 'action',
    });
  }
}
