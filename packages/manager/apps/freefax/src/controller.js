export default class FreefaxAppController {
  /* @ngInject */
  constructor($scope, $rootScope, coreConfig, ovhFeatureFlipping) {
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.coreConfig = coreConfig;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
  }

  checkChatbotFeature() {
    const CHATBOT_FEATURE = 'chatbot';
    this.ovhFeatureFlipping
      .checkFeatureAvailability(CHATBOT_FEATURE)
      .then((featureAvailability) => {
        this.chatbotEnabled = featureAvailability.isFeatureAvailable(
          CHATBOT_FEATURE,
        );
        if (this.chatbotEnabled) {
          this.$rootScope.$broadcast('ovh-chatbot:enable', this.chatbotEnabled);
        }
      });
  }

  $onInit() {
    this.chatbotEnabled = false;
    this.user = this.coreConfig.getUser();
    this.currentLanguage = this.coreConfig.getUserLanguage();

    const unregisterListener = this.$scope.$on('app:started', () => {
      this.checkChatbotFeature();
      unregisterListener();
    });
  }
}
