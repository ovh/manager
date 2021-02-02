import { emit, listen } from '@ovh-ux/ufrontend/communication';

export default class FreefaxAppController {
  /* @ngInject */
  constructor($timeout, $rootScope) {
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
  }

  $onInit() {
    this.$rootScope.$on('ovh::notifications::count', (event, count) => {
      emit({ id: 'ovh.notifications.count', count });
    });

    listen(({ id }) => {
      if (id === 'ovh.notifications.toggle') {
        this.$timeout(() => {
          this.$rootScope.$broadcast('ovh::notifications::toggle');
        }, 0);
      }
    });
  }
}
