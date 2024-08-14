angular.module('App').controller(
  'DoubleAuthBackupCodeCtrl',
  class DoubleAuthBackupCodeCtrl {
    /* @ngInject */
    constructor($scope, $q, OvhHttp) {
      this.$scope = $scope;
      this.$q = $q;
      this.OvhHttp = OvhHttp;
    }

    $onInit() {
      this.$scope.stepPath = '';
      this.$scope.backupCodeStatus = null;

      this.$scope.setAction = (action, data) => {
        this.$scope.currentAction = action;
        this.$scope.currentActionData = data;

        if (this.$scope.currentActionData) {
          this.$scope.stepPath = `double-authentication/${this.$scope.currentAction}.html`;
          $('#double-auth-backup-code-alert').modal({
            keyboard: false,
            backdrop: 'static',
          });
        } else {
          this.$scope.stepPath = '';
          $('#double-auth-backup-code-alert').modal('hide');
        }
      };

      this.$scope.resetAction = () => this.$scope.setAction(false);

      this.$scope.getDoubleAuthBackupCode = () =>
        this.OvhHttp.get('/me/accessRestriction/backupCode', {
          rootPath: 'apiv6',
        })
          .then((sotpAccount) => {
            this.$scope.backupCodeStatus = sotpAccount;
            if (
              this.$scope.backupCodeStatus.status === 'enabled' &&
              this.$scope.backupCodeStatus.remaining <= 3
            ) {
              this.$scope.setAction(
                'doubleAuthAlert',
                this.$scope.backupCodeStatus,
              );
            }
          })
          .catch(() => {
            this.$scope.backupCodeStatus = null;
          });

      this.$scope.getDoubleAuthBackupCode();
    }
  },
);
