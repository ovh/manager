import get from 'lodash/get';

{
  class controller {
    constructor($scope, $state, $translate, Alerter, dedicatedServerOVHTasks) {
      this.$scope = $scope;
      this.$state = $state;
      this.$translate = $translate;

      this.Alerter = Alerter;
      this.dedicatedServerOVHTasks = dedicatedServerOVHTasks;
    }

    $onInit() {
      this.isLoading = true;

      return this.dedicatedServerOVHTasks
        .fetchingTasks()
        .then(({ items: tasks }) => {
          this.tasks = tasks;
        })
        .catch((error) => {
          this.$state.go('^');
          this.Alerter.set(
            'alert-danger',
            [
              this.$translate.instant(
                'dedicated_server_ovhTasks_fetching_error',
              ),
              get(error, 'message', error),
            ].join(' '),
          );
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  }

  angular.module('App').component('dedicatedServerOVHTasks', {
    controller,
    templateUrl: 'dedicated/server/ovh-tasks/dedicated-server-ovh-tasks.html',
  });
}
