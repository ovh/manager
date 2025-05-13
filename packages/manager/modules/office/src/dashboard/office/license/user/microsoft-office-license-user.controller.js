import set from 'lodash/set';

export default class MicrosoftOfficeLicenseUsersCtrl {
  /* @ngInject */
  constructor(
    MicrosoftOfficeLicenseService,
    $stateParams,
    $scope,
    $timeout,
    Alerter,
  ) {
    this.license = MicrosoftOfficeLicenseService;
    this.currentLicense = $stateParams.serviceName;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.Alerter = Alerter;
  }

  $onInit() {
    this.$scope.$on('microsoft.office.license.user.add', () =>
      this.refreshUsers(),
    );
    this.$scope.$on('microsoft.office.license.user.edit', () =>
      this.refreshUsers(),
    );
    this.$scope.$on('microsoft.office.license.user.delete', () =>
      this.refreshUsers(),
    );

    this.getUserIds();
  }

  transformItem({ id }) {
    return this.license
      .getUserDetails(this.$scope.currentLicense, id)
      .then((details) => {
        if (details.taskPendingId) {
          set(details, 'isLoading', true);
          set(
            details,
            'status',
            details.status === 'ok' ? 'updating' : details.status,
          );
          this.license
            .pollUserDetails(this.$scope.currentLicense, id, this.$scope)
            .then(() => this.delayedGetUsers())
            .finally(() => {
              set(details, 'isLoading', false);
            });
        }
        return details;
      })
      .catch(() => ({
        id,
        activationEmail: id,
        status: 'error',
      }));
  }

  getUserIds() {
    this.users = null;

    return this.license
      .getUsers(this.currentLicense)
      .then((users) => {
        this.users = users.map((id) => ({ id }));
      })
      .catch((err) => this.Alerter.error(err.message, this.$scope.alerts.tabs));
  }

  delayedGetUsers() {
    return this.$timeout(() => this.getUserIds(), 250);
  }

  scrollToAlert() {
    this.$timeout(() =>
      document.getElementById('action-alert').scrollIntoView(false),
    );
  }

  refreshUsers() {
    this.delayedGetUsers();
    this.scrollToAlert();
  }
}
