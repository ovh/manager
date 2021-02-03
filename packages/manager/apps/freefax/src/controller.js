import { emit, listen } from '@ovh-ux/ufrontend/communication';
import { Environment } from '@ovh-ux/manager-config';

export default class FreefaxAppController {
  /* @ngInject */
  constructor($timeout, $scope, $rootScope, ovhFeatureFlipping) {
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
  }

  $onInit() {
    this.chatbotEnabled = false;
    this.user = Environment.getUser();
    this.currentLanguage = Environment.getUserLanguage();
    emit({ id: 'ovh.account-sidebar.ready' });

    this.$rootScope.$on('ovh::notifications::count', (event, count) => {
      emit({ id: 'ovh.notifications.count', count });
    });

    const forwardEvents = {
      'ovh.notifications.toggle': 'ovh::notifications::toggle',
      'ovh.notifications.hide': 'ovh::notifications::hide',
      'ovh.account-sidebar.toggle': 'ovh::sidebar::toggle',
      'ovh.account-sidebar.hide': 'ovh::sidebar::hide',
    };

    listen(({ id }) => {
      const eventName = forwardEvents[id] || undefined;
      if (eventName) {
        this.$timeout(() => {
          this.$rootScope.$broadcast(eventName);
        }, 0);
      }
    });

    const unregisterListener = this.$scope.$on('app:started', () => {
      const CHATBOT_FEATURE = 'chatbot';
      this.ovhFeatureFlipping
        .checkFeatureAvailability(CHATBOT_FEATURE)
        .then((featureAvailability) => {
          this.chatbotEnabled = featureAvailability.isFeatureAvailable(
            CHATBOT_FEATURE,
          );
          if (this.chatbotEnabled) {
            this.$rootScope.$broadcast(
              'ovh-chatbot:enable',
              this.chatbotEnabled,
            );
          }
        });
      unregisterListener();
    });
  }
}
