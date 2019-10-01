import get from 'lodash/get';

angular.module('UserAccount').controller('UserAccount.controllers.ssh', [
  '$scope',
  '$q',
  '$translate',
  'UserAccount.services.ssh',
  'User',
  'constants',
  '$log',
  'Alerter',
  '$timeout',
  function UserAccountSshController(
    $scope,
    $q,
    $translate,
    UseraccountSshService,
    User,
    constants,
    $log,
    Alerter,
    $timeout,
  ) {
    const self = this;

    self.filters = {};

    self.init = function init() {
      self.sshKeyList = [];
      self.sshLoading = true;
      UseraccountSshService.getAllSshKeyList(self.filters)
        .then((sshKeys) => {
          self.sshKeyList = sshKeys;
        })
        .catch((err) => {
          Alerter.error(`${$translate.instant('user_ssh_error')} ${get(err, 'message') || err}`, 'userSsh');
        })
        .finally(() => {
          self.sshLoading = false;
        });
    };

    self.onTransformItemDone = function onTransformItemDone() {
      self.sshLoading = false;
    };

    self.setDefaultDedicatedSshKey = function setDefaultDedicatedSshKey(sshObj) {
      UseraccountSshService.setDefaultDedicatedSshKey(sshObj).then(
        () => {
          if (!sshObj.default) {
            // Switch to true
            Alerter.success($translate.instant('user_ssh_default_on_success_message', { t0: sshObj.keyName }), 'userSsh');
          } else {
            // Switch to false
            Alerter.success($translate.instant('user_ssh_default_off_success_message'), 'userSsh');
          }
        },
        (err) => {
          Alerter.error(`${$translate.instant('user_ssh_default_error_message')} ${get(err, 'message') || err}`, 'userSsh');
        },
      );
    };

    self.onCategoryFilterChanged = function onCategoryFilterChanged() {
      self.init();
    };

    $scope.$on('useraccount.ssh.refresh', () => {
      self.init();
    });

    function getGuideUrl(language, guideName) {
      return constants.urls[language].guides[guideName] || constants.URLS.GB.guides[guideName];
    }

    function initGuides() {
      self.guidesLoading = true;
      return User.getUser()
        .then((user) => {
          self.guides = {
            sshCreate: getGuideUrl(user.ovhSubsidiary, 'sshCreate'),
            sshAdd: getGuideUrl(user.ovhSubsidiary, 'sshAdd'),
            sshChange: getGuideUrl(user.ovhSubsidiary, 'sshChange'),
          };
          self.user = user;
        })
        .catch((error) => {
          $log.error(error);
        })
        .finally(() => {
          self.guidesLoading = false;
        });
    }

    $scope.setAction = function setAction(action, data) {
      $scope.currentAction = action;
      $scope.currentActionData = data;

      if ($scope.currentAction) {
        $scope.stepPath = `billing/autoRenew/${action}.html`;

        $('#sshAction').modal({
          keyboard: false,
          backdrop: 'static',
        });
      } else {
        $('#sshAction').modal('hide');

        $timeout(() => {
          delete $scope.stepPath;
        }, 300);
      }
    };

    $scope.resetAction = function resetAction() {
      $scope.setAction();
    };

    self.init();
    initGuides();
  },
]);
