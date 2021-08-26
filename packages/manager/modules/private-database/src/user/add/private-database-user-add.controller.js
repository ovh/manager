import indexOf from 'lodash/indexOf';

export default class PrivateDatabaseAddUserCtrl {
  /* @ngInject */
  constructor($scope, $stateParams, $translate, Alerter, PrivateDatabase) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.PrivateDatabase = PrivateDatabase;
  }

  $onInit() {
    this.users = this.$scope.currentActionData.user;
    this.model = {
      password: {
        value: '',
        confirm: '',
        condition: {
          pattern: /^(?=[a-z0-9A-Z]*[A-Z])(?=[a-z0-9A-Z]*[a-z])(?=[a-z0-9A-Z]*[0-9])[a-z0-9A-Z]*$/,
          length: {
            min: 8,
            max: 31,
          },
        },
      },
      user: {
        value: '',
        condition: {
          pattern: /^[\w\d\-.]*$/,
          length: {
            min: 1,
            max: 16,
          },
        },
      },
    };

    this.$scope.hasError = (label) => label.$invalid && label.$dirty;
    this.$scope.addUser = () => this.addUser();
  }

  isPasswordValid() {
    return (
      this.model.password.value &&
      this.model.password.value.length &&
      this.model.password.condition.pattern.test(this.model.password.value)
    );
  }

  isPasswordConfirmed() {
    return this.model.password.value === this.model.password.confirm;
  }

  isNameValid() {
    return (
      this.model.user.value &&
      this.model.user.value.length &&
      this.model.user.condition.pattern.test(this.model.user.value) &&
      !this.nameAlreadyExist()
    );
  }

  nameAlreadyExist() {
    return indexOf(this.users, this.model.user.value) !== -1;
  }

  addUser() {
    this.$scope.resetAction();
    return this.PrivateDatabase.addUser(
      this.$stateParams.productId,
      this.model.password.value,
      this.model.user.value,
    )
      .then(() => {
        this.Alerter.success(
          this.$translate.instant('privateDatabase_add_user_success'),
          this.$scope.alerts.main,
        );
      })
      .catch(() => {
        this.Alerter.error(
          this.$translate.instant('privateDatabase_add_user_fail'),
          this.$scope.alerts.main,
        );
      });
  }
}
