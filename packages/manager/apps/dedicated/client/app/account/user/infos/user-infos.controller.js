import identity from 'lodash/identity';
import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';

export default class UserAccountInfosController {
  /* @ngInject */
  constructor(
    $q,
    $location,
    $translate,
    userAccountServiceInfos,
    Alerter,
    coreConfig,
  ) {
    this.$q = $q;
    this.$location = $location;
    this.$translate = $translate;
    this.userAccountServiceInfos = userAccountServiceInfos;
    this.Alerter = Alerter;
    this.coreConfig = coreConfig;
  }

  $onInit() {
    this.loading = true;
    this.loadCreationRules = false;
    this.dateFormat = 'yyyy/MM/dd';

    this.alerts = {
      dashboardInfos: 'useraccount.alerts.dashboardInfos',
    };

    this.controls = {
      legalforms: [
        'association',
        'corporation',
        'administration',
        'individual',
        'other',
      ],
      taskEmailChangeTodo: null,
      validateEmailChange: null,
      countries: null,
    };

    this.worldPart = this.coreConfig.getRegion();
    this.user = null;

    /* The url is watched to switch between the main view and the validation/refuse
     * of the master email view */
    this.searchParams = this.$location.search();

    if (
      this.searchParams.taskId &&
      this.searchParams.validateEmailChange === 'true'
    ) {
      this.controls.validateEmailChange = {
        error: false,
        loading: false,
        taskId: this.searchParams.taskId,
        token: this.searchParams.token,
      };
      return this.loadTaskForEmailValidation(
        this.controls.validateEmailChange.taskId,
      );
    }
    return this.$q
      .all({
        loadUserInfos: this.loadUserInfos(),
        getTaskEmailChange: this.getTaskEmailChange(),
      })
      .catch((err) => {
        return this.Alerter.alertFromSWS(
          this.$translate.instant('user_account_info_error'),
          err.data,
          'InfoAlert',
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  loadUserInfos() {
    return this.userAccountServiceInfos
      .getMeModels()
      .then((model) => {
        const props = model['nichandle.Nichandle'].properties;
        this.readOnlyProperties = Object.entries(props).flatMap(
          ([key, value]) => {
            if (value.readOnly) {
              return [key];
            }
            return [];
          },
        );
      })
      .then(() => this.userAccountServiceInfos.getListOfRulesFieldName())
      .then((fieldNames) =>
        this.userAccountServiceInfos.getUseraccountInfos().then((response) => {
          // pick attributes that belong to /rules
          // add customer code since it will be displayed in the form
          this.user = pick(response, fieldNames.concat('customerCode'));

          // remove empty attributes
          this.user = pickBy(this.user, identity);

          // juste in case birthday date is retrieved in legacy format
          // we nullify it so we don't break the first call to /rules
          if (
            !moment(this.user.birthDay, 'YYYY-MM-DD', true).isValid() ||
            /\//.test(this.user.birthDay)
          ) {
            delete this.user.birthDay;
          }
        }),
      );
  }

  getTaskEmailChange() {
    return this.userAccountServiceInfos
      .taskEmailChanges('todo')
      .then((taskIds) => {
        if (taskIds.length > 0) {
          // get only for the last
          this.userAccountServiceInfos
            .taskEmailChange(taskIds.slice(-1))
            .then((task) => {
              if (task.state === 'todo') {
                this.controls.taskEmailChangeTodo = task;
              }
            });
        }
      });
  }

  onProfileUpdate() {
    this.user = null;
    return this.$q.all({
      loadUserInfos: this.loadUserInfos(),
      getTaskEmailChange: this.getTaskEmailChange(),
    });
  }

  resetInfoView() {
    this.$location.search('validateEmailChange', null);
    this.$location.search('taskId', null);
    this.$location.search('token', null);

    // ui-router quickwin : $location doesnt reload anymore
    // so we update the scope directly
    this.controls.taskEmailChangeTodo = null;
    this.controls.validateEmailChange = null;
    return this.loadUserInfos();
  }

  cancel() {
    this.edit = false;
  }

  loadTaskForEmailValidation(taskId) {
    this.userAccountServiceInfos.taskEmailChange(taskId).then(
      (task) => {
        if (!task) {
          return this.Alerter.alertFromSWS(
            this.$translate.instant('user_account_info_error'),
            new Error('task not found.'),
            'InfoAlert',
          );
        }

        this.controls.validateEmailChange.data = task;

        if (task.state !== 'todo') {
          this.controls.validateEmailChange.error = true;
          switch (task.state) {
            case 'done':
              this.Alerter.alertFromSWS(
                this.$translate.instant(
                  'user_account_email_token_already_accepted',
                ),
                null,
                'InfoAlert',
              );
              break;
            case 'refused':
              this.Alerter.alertFromSWS(
                this.$translate.instant(
                  'user_account_email_token_already_refused',
                ),
                null,
                'InfoAlert',
              );
              break;
            default:
              this.Alerter.alertFromSWS(
                this.$translate.instant('user_account_email_token_expired'),
                null,
                'InfoAlert',
              );
              break;
          }
        }
        return task;
      },
      (err) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant('user_account_info_error'),
          err.data,
          'InfoAlert',
        );
      },
    );
  }

  acceptOrRefuseEmailSuccess() {
    return this.resetInfoView();
  }

  acceptOrRefuseEmailError(err) {
    this.Alerter.alertFromSWS(
      this.$translate.instant('user_account_info_error'),
      err.data,
      'InfoAlert',
    );
    this.controls.validateEmailChange.loading = false;
  }

  acceptOrRefuseEmail(accept) {
    this.Alerter.resetMessage('InfoAlert');
    this.controls.validateEmailChange.loading = true;

    if (accept) {
      return this.userAccountServiceInfos
        .taskEmailChangeAccept(
          this.controls.validateEmailChange.data.id,
          this.controls.validateEmailChange.token,
        )
        .then(() => this.acceptOrRefuseEmailSuccess())
        .catch((err) => this.acceptOrRefuseEmailError(err));
    }
    return this.userAccountServiceInfos
      .taskEmailChangeRefuse(
        this.controls.validateEmailChange.data.id,
        this.controls.validateEmailChange.token,
      )
      .then(() => this.acceptOrRefuseEmailSuccess())
      .catch((err) => this.acceptOrRefuseEmailError(err));
  }

  acceptEmail() {
    return this.acceptOrRefuseEmail(true);
  }

  refuseEmail() {
    return this.acceptOrRefuseEmail();
  }

  validateTaskWithToken() {
    this.$location.search({
      validateEmailChange: 'true', // string not boolean
      taskId: this.controls.taskEmailChangeTodo.id,
    });

    // ui-router quickwin : $location doesnt reload anymore
    // so we update the scope directly
    this.searchParams = this.$location.search();
    this.controls.validateEmailChange = {
      error: false,
      loading: false,
      taskId: this.searchParams.taskId,
      token: this.searchParams.token,
    };
    return this.loadTaskForEmailValidation(
      this.controls.validateEmailChange.taskId,
    );
  }

  requestChangeEmailToken(email) {
    this.requestingToken = true;
    return this.userAccountServiceInfos
      .changeEmail(email)
      .then(({ id }) => {
        this.controls.taskEmailChangeTodo.id = id;
        this.requestingToken = false;
        this.Alerter.success(
          this.$translate.instant('user_account_email_token_resend_success'),
          'InfoAlert',
        );
      })
      .catch((error) => {
        this.requestingToken = false;
        this.Alerter.alertFromSWS(
          this.$translate.instant('user_account_email_token_resend_error'),
          error.data,
          'InfoAlert',
        );
      });
  }

  isMandatory(field) {
    return this.edit && this.creationRules[field].mandatory;
  }

  getRegexp(field) {
    let pattern = '';
    if (this.edit && this.creationRules[field].regularExpression) {
      pattern = this.creationRules[field].regularExpression;
    }
    return pattern;
  }

  getInputClass(field) {
    let accountField;

    if (this.edit) {
      accountField = this.myAccountForm[field];
      if (accountField.$dirty) {
        if (accountField.$valid) {
          return 'success';
        }
        if (accountField.$invalid) {
          return 'error';
        }
      }
    }

    return '';
  }
}
