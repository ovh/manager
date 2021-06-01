import identity from 'lodash/identity';
import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';

export default /* @ngInject */ function UserAccountInfosController(
  $scope,
  $q,
  $location,
  $translate,
  userAccountServiceInfos,
  Alerter,
  coreConfig,
) {
  /* Be carefull, a part of this controller is url driven.
   * See the bottom of this file for more detail */
  let searchParams;

  $scope.loading = false;
  $scope.loadCreationRules = false;
  $scope.dateFormat = 'yyyy/MM/dd';

  $scope.alerts = {
    dashboardInfos: 'useraccount.alerts.dashboardInfos',
  };

  $scope.controls = {
    legalforms: [
      'association',
      'corporation',
      'administration',
      'individual',
      'other',
    ],
    taskEmailChangesTodo: null,
    validateEmailChange: null,
    countries: null,
  };

  $scope.worldPart = coreConfig.getRegion();
  $scope.user = null;

  function loadUserInfos() {
    $scope.loading = true;

    let promise = userAccountServiceInfos.getMeModels().then((model) => {
      const props = model['nichandle.Nichandle'].properties;
      const readOnlyProperties = [];
      /* eslint-disable no-restricted-syntax */
      for (const key in props) {
        if (props[key].readOnly) {
          readOnlyProperties.push(key);
        }
      }
      /* eslint-enable no-restricted-syntax */
      $scope.readOnlyProperties = readOnlyProperties;
    });

    promise = promise.then(() =>
      userAccountServiceInfos.getListOfRulesFieldName(),
    );

    promise
      .then((fieldNames) =>
        userAccountServiceInfos.getUseraccountInfos().then((response) => {
          // pick attributes that belong to /rules
          // add customer code since it will be displayed in the form
          $scope.user = pick(response, fieldNames.concat('customerCode'));

          // remove empty attributes
          $scope.user = pickBy($scope.user, identity);

          // juste in case birthday date is retrieved in legacy format
          // we nullify it so we don't break the first call to /rules
          if (
            !moment($scope.user.birthDay, 'YYYY-MM-DD', true).isValid() ||
            /\//.test($scope.user.birthDay)
          ) {
            delete $scope.user.birthDay;
          }
        }),
      )
      .catch((err) => {
        Alerter.alertFromSWS(
          $translate.instant('user_account_info_error'),
          err.data,
          'InfoAlert',
        );
      })
      .finally(() => {
        $scope.loading = false;
      });

    $scope.controls.taskEmailChangeTodo = null;
    userAccountServiceInfos.taskEmailChanges('todo').then(
      (taskIds) => {
        if (taskIds && taskIds.length > 0) {
          // get only for the last
          userAccountServiceInfos.taskEmailChange(taskIds.slice(-1)).then(
            (task) => {
              if (task && task.state === 'todo') {
                $scope.controls.taskEmailChangeTodo = task;
              }
            },
            (err) => {
              Alerter.alertFromSWS(
                $translate.instant('user_account_info_error'),
                err.data,
                'InfoAlert',
              );
            },
          );
        }
      },
      (err) => {
        Alerter.alertFromSWS(
          $translate.instant('user_account_info_error'),
          err.data,
          'InfoAlert',
        );
      },
    );
  }

  $scope.onProfileUpdate = function onProfileUpdate() {
    $scope.user = null;
    loadUserInfos();
  };

  $scope.resetInfoView = function resetInfoView() {
    $location.search('validateEmailChange', null);
    $location.search('taskId', null);
    $location.search('token', null);

    // ui-router quickwin : $location doesnt reload anymore
    // so we update the scope directly
    $scope.controls.validateEmailChange = null;
    loadUserInfos();
  };

  $scope.cancel = function cancel() {
    $scope.edit = false;
  };

  function loadTaskForEmailValidation(taskId) {
    userAccountServiceInfos.taskEmailChange(taskId).then(
      (task) => {
        if (!task) {
          return Alerter.alertFromSWS(
            $translate.instant('user_account_info_error'),
            new Error('task not found.'),
            'InfoAlert',
          );
        }

        $scope.controls.validateEmailChange.data = task;

        if (task.state !== 'todo') {
          $scope.controls.validateEmailChange.error = true;
          switch (task.state) {
            case 'done':
              Alerter.alertFromSWS(
                $translate.instant('user_account_email_token_already_accepted'),
                null,
                'InfoAlert',
              );
              break;
            case 'refused':
              Alerter.alertFromSWS(
                $translate.instant('user_account_email_token_already_refused'),
                null,
                'InfoAlert',
              );
              break;
            default:
              Alerter.alertFromSWS(
                $translate.instant('user_account_email_token_expired'),
                null,
                'InfoAlert',
              );
              break;
          }
        }
        return task;
      },
      (err) => {
        Alerter.alertFromSWS(
          $translate.instant('user_account_info_error'),
          err.data,
          'InfoAlert',
        );
      },
    );
  }

  function acceptOrRefuseEmailSuccess() {
    $scope.resetInfoView();
  }

  function acceptOrRefuseEmailError(err) {
    Alerter.alertFromSWS(
      $translate.instant('user_account_info_error'),
      err.data,
      'InfoAlert',
    );
    $scope.controls.validateEmailChange.loading = false;
  }

  function acceptOrRefuseEmail(accept) {
    Alerter.resetMessage('InfoAlert');
    $scope.controls.validateEmailChange.loading = true;

    if (accept) {
      userAccountServiceInfos
        .taskEmailChangeAccept(
          $scope.controls.validateEmailChange.data.id,
          $scope.controls.validateEmailChange.token,
        )
        .then(acceptOrRefuseEmailSuccess, acceptOrRefuseEmailError);
    } else {
      userAccountServiceInfos
        .taskEmailChangeRefuse(
          $scope.controls.validateEmailChange.data.id,
          $scope.controls.validateEmailChange.token,
        )
        .then(acceptOrRefuseEmailSuccess, acceptOrRefuseEmailError);
    }
  }

  $scope.acceptEmail = function acceptEmail() {
    acceptOrRefuseEmail(true);
  };

  $scope.refuseEmail = function refuseEmail() {
    acceptOrRefuseEmail();
  };

  $scope.validateTaskWithToken = function validateTaskWithToken() {
    $location.search({
      validateEmailChange: 'true', // string not boolean
      taskId: $scope.controls.taskEmailChangeTodo.id,
    });

    // ui-router quickwin : $location doesnt reload anymore
    // so we update the scope directly
    searchParams = $location.search();
    $scope.controls.validateEmailChange = {
      error: false,
      loading: false,
      taskId: searchParams.taskId,
      token: searchParams.token,
    };
    loadTaskForEmailValidation($scope.controls.validateEmailChange.taskId);
  };

  $scope.requestChangeEmailToken = function requestChangeEmailToken(email) {
    $scope.requestingToken = true;
    return userAccountServiceInfos
      .changeEmail(email)
      .then(({ id }) => {
        $scope.controls.taskEmailChangeTodo.id = id;
        $scope.requestingToken = false;
        Alerter.success(
          $translate.instant('user_account_email_token_resend_success'),
          'InfoAlert',
        );
      })
      .catch((error) => {
        $scope.requestingToken = false;
        Alerter.alertFromSWS(
          $translate.instant('user_account_email_token_resend_error'),
          error.data,
          'InfoAlert',
        );
      });
  };

  $scope.isMandatory = function isMandatory(field) {
    return $scope.edit && $scope.creationRules[field].mandatory;
  };

  $scope.getRegexp = function getRegexp(field) {
    let pattern = '';
    if ($scope.edit && $scope.creationRules[field].regularExpression) {
      pattern = $scope.creationRules[field].regularExpression;
    }
    return pattern;
  };

  $scope.getInputClass = function getInputClass(field) {
    let accountField;

    if ($scope.edit) {
      accountField = $scope.myAccountForm[field];
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
  };

  /* The url is watched to switch between the main view and the validation/refuse
   * of the master email view */
  searchParams = $location.search();
  if (searchParams.taskId && searchParams.validateEmailChange === 'true') {
    $scope.controls.validateEmailChange = {
      error: false,
      loading: false,
      taskId: searchParams.taskId,
      token: searchParams.token,
    };
    loadTaskForEmailValidation($scope.controls.validateEmailChange.taskId);
  } else {
    loadUserInfos();
  }
}
