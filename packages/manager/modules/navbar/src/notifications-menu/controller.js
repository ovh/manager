export default class NotificationsCtrl {
  /* @ngInject */
  constructor($rootScope) {
    this.$rootScope = $rootScope;
  }

  $onInit() {
    this.isLoading = true;
    this.numberOfActiveNotifications = 0;

    this.$rootScope.$on('ovh::notifications::count', (event, count) => {
      this.numberOfActiveNotifications = count;
      this.isLoading = false;
    });
  }

  onClick() {
    this.$rootScope.$emit('ovh::notifications::toggle');
    this.$rootScope.$emit('ovh::sidebar::hide');
  }
}
