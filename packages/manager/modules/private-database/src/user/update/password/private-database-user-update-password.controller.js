import get from 'lodash/get';

export default class PrivateDatabaseUpdatePasswordCtrl {
  /* @ngInject */
  constructor(
    Alerter,
    PrivateDatabase,
    $rootScope,
    $scope,
    $stateParams,
    $translate,
  ) {
    this.alerter = Alerter;
    this.privateDatabaseService = PrivateDatabase;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
  }

  $onInit() {
    this.productId = this.$stateParams.productId;

    this.model = {
      password: {
        value: '',
        confirmation: '',
        condition: {
          pattern: /^(?=[a-z0-9A-Z]*[A-Z])(?=[a-z0-9A-Z]*[a-z])(?=[a-z0-9A-Z]*[0-9])[a-z0-9A-Z]*$/,
          length: {
            min: 8,
            max: 31,
          },
        },
        type: null,
      },
    };

    this.windowTitleTranslationKey = null;

    let database = null;
    this.user = null;

    if (this.$scope.currentActionData) {
      database = this.$scope.currentActionData.database
        ? this.$scope.currentActionData.database
        : null;
      this.user = this.$scope.currentActionData.user
        ? this.$scope.currentActionData.user
        : null;

      this.model.password.type = this.$scope.currentActionData.passwordType
        ? this.$scope.currentActionData.passwordType
        : null;

      if (database && database.infrastructure === 'legacy') {
        if (this.model.password.type === 'root') {
          this.windowTitleTranslationKey = 'privateDatabase_password_docker';
        } else {
          this.windowTitleTranslationKey = 'privateDatabase_password_legacy';
        }
      }
    }

    this.prefix = this.user ? 'root' : 'user';

    this.$scope.hasError = (label) => label.$invalid && label.$dirty;

    this.$scope.updatePassword = () => {
      this.$scope.resetAction();

      this.privateDatabaseService
        .changePassword(
          this.productId,
          this.model.password.value,
          this.user,
          this.model.password.type,
        )
        .then((_task) => {
          let task = _task;

          if (!this.user) {
            task = {
              id: _task,
            };

            task.function = 'changeRootPassword';
          }
          this.$scope.pollAction(task);
          this.alerter.success(
            this.$translate.instant(
              `privateDatabase_change_${this.prefix}Password_success`,
            ),
            this.$scope.alerts.main,
          );
        })
        .catch((err) => {
          this.alerter.alertFromSWS(
            this.$translate.instant(
              `privateDatabase_change_${this.prefix}Password_fail`,
            ),
            get(err, 'data', err),
            this.$scope.alerts.main,
          );
        });
    };

    this.$scope.cancelAction = () => {
      if (this.model.password.type === 'root') {
        this.$rootScope.$broadcast(
          'privateDataBase.action.change.root.password.cancel',
        );
      } else {
        this.$rootScope.$broadcast(
          'privateDataBase.action.change.ftp.password.cancel',
        );
      }

      this.$scope.resetAction();
    };
  }

  isPasswordValid() {
    return (
      this.model.password.value &&
      this.model.password.value.length &&
      this.model.password.value === this.model.password.confirmation &&
      this.model.password.condition.pattern.test(this.model.password.value)
    );
  }

  static getClassLabel(label, errorValue) {
    if (label && label.$dirty) {
      return label.$invalid || errorValue ? 'has-error' : 'has-success';
    }
    return '';
  }
}
