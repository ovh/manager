import { isString } from 'lodash-es';
import { isTopLevelApplication } from '@ovh-ux/manager-config';
import { getShellClient } from './shell';

export default class HubController {
  /* @ngInject */
  constructor(
    $document,
    $http,
    $scope,
    $state,
    $rootScope,
    coreConfig,
    ovhFeatureFlipping,
    liveChatService,
  ) {
    this.$document = $document;
    this.$http = $http;
    this.$scope = $scope;
    this.$state = $state;
    this.$rootScope = $rootScope;
    this.chatbotEnabled = false;
    this.coreConfig = coreConfig;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
    this.isTopLevelApplication = isTopLevelApplication();
    this.shell = getShellClient();
    this.isAccountSidebarVisible = false;
    this.liveChatService = liveChatService;
  }

  async $onInit() {
    this.navbarOptions = {
      universe: this.coreConfig.getUniverse(),
      toggle: {
        event: 'sidebar:loaded',
      },
    };
    this.currentLanguage = this.coreConfig.getUserLanguage();
    this.me = this.coreConfig.getUser();
    const unregisterListener = this.$scope.$on('app:started', () => {
      const CHATBOT_FEATURE = 'chatbot';
      this.ovhFeatureFlipping
        .checkFeatureAvailability(CHATBOT_FEATURE)
        .then((featureAvailability) => {
          this.chatbotEnabled = featureAvailability.isFeatureAvailable(
            CHATBOT_FEATURE,
          );
          if (this.chatbotEnabled) {
            this.showLivechat = this.liveChatService.getShowLivechat();
            this.$rootScope.$broadcast(
              'ovh-chatbot:enable',
              this.chatbotEnabled,
            );
          }
        });
      unregisterListener();
    });
    this.isAccountSidebarVisible = await this.shell.ux.isAccountSidebarVisible();
  }

  /**
   * Set focus on the specified element.
   * @param  {string} id Element to locate.
   * @return {void}
   */
  setFocus(id) {
    if (isString(id)) {
      const [element] = this.$document.find(`#${id}`);
      element.focus();
    }
  }

  onChatbotOpen() {
    this.shell.ux.onChatbotOpen();
  }

  onChatbotClose(reduced) {
    this.shell.ux.onChatbotClose(reduced);
  }
}
