import { emit, listen } from '@ovh-ux/ufrontend/communication';
import { Environment } from '@ovh-ux/manager-config';

export default class FreefaxAppController {
  /* @ngInject */
  constructor($timeout, $rootScope) {
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
  }

  $onInit() {
    this.user = Environment.getUser();
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
  }
}
