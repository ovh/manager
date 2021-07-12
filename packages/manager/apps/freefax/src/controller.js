import { emit, listen } from '@ovh-ux/ufrontend';

export default class FreefaxAppController {
  /* @ngInject */
  constructor($timeout, $scope, $rootScope, coreConfig, ovhFeatureFlipping) {
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
    this.coreConfig = coreConfig;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
  }

  emitEvents() {
    // emit AngularJS events to ufrontend
    const emitEvents = {
      'ovh::notifications::count': {
        id: 'ovh.notifications.count',
        property: 'count',
      },
      'ovh::notifications::statuschange': {
        id: 'ovh.notifications.status.change',
        property: 'status',
      },
    };

    Object.keys(emitEvents).forEach((eventName) => {
      const { id, property } = emitEvents[eventName];
      this.$rootScope.$on(eventName, (event, data) => {
        emit({
          id,
          [property]: data,
        });
      });
    });
  }

  broadcastEvents() {
    // brodcast ufrontend events to AngularJS
    const broadcastEvents = {
      'ovh.notifications.toggle': 'ovh::notifications::toggle',
      'ovh.notifications.hide': 'ovh::notifications::hide',
      'ovh.notifications.open': [
        'ovh::notifications::open',
        'ovh::sidebar::hide',
      ],
      'ovh.account-sidebar.toggle': 'ovh::sidebar::toggle',
      'ovh.account-sidebar.hide': 'ovh::sidebar::hide',
    };

    listen(({ id, origin, ...props }) => {
      const eventName = broadcastEvents[id] || undefined;
      if (eventName) {
        this.$timeout(() => {
          if (Array.isArray(eventName)) {
            eventName.forEach((event) => {
              this.$rootScope.$broadcast(event, props);
            });
          } else {
            this.$rootScope.$broadcast(eventName, props);
          }
        }, 0);
      } else if (id === 'locale.change') {
        this.$rootScope.$broadcast('lang.onChange', { lang: props.locale });
      }
    });
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
    emit({ id: 'ovh.account-sidebar.ready' });

    this.emitEvents();
    this.broadcastEvents();

    const unregisterListener = this.$scope.$on('app:started', () => {
      this.checkChatbotFeature();
      unregisterListener();
    });
  }
}
