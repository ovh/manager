import get from 'lodash/get';

export default class UserAccountSshCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $q,
    $timeout,
    $translate,
    UseraccountSshService,
    ducUser,
    constants,
    $log,
    Alerter,
  ) {
    this.$scope = $scope;
    this.$q = $q;
    this.$translate = $translate;
    this.UseraccountSshService = UseraccountSshService;
    this.User = ducUser;
    this.constants = constants;
    this.$log = $log;
    this.Alerter = Alerter;
    this.$timeout = $timeout;
  }

  $onInit() {
    this.filters = {};
    this.initGuides();
    this.getSshKeys();

    this.$scope.$on('useraccount.ssh.refresh', () => {
      this.getSshKeys();
    });

    this.$scope.setAction = (action, data) => {
      this.$scope.currentAction = action;
      this.$scope.currentActionData = data;

      if (this.$scope.currentAction) {
        this.$scope.stepPath = `billing/autoRenew/${action}.html`;

        $('#sshAction').modal({
          keyboard: false,
          backdrop: 'static',
        });
      } else {
        $('#sshAction').modal('hide');

        this.$timeout(() => {
          delete this.$scope.stepPath;
        }, 300);
      }
    };

    this.$scope.resetAction = () => {
      this.$scope.setAction();
    };
  }

  getSshKeys() {
    this.sshKeyList = [];
    this.sshLoading = true;
    return this.UseraccountSshService.getAllSshKeyList(this.filters)
      .then((sshKeys) => {
        this.sshKeyList = sshKeys;
      })
      .catch(([sshKeys]) => {
        this.sshKeyList = sshKeys;
        this.Alerter.error(
          `${this.$translate.instant('user_ssh_error')}`,
          'userSsh',
        );
      })
      .finally(() => {
        this.sshLoading = false;
      });
  }

  onTransformItemDone() {
    this.sshLoading = false;
  }

  setDefaultDedicatedSshKey(sshObj) {
    this.UseraccountSshService.setDefaultDedicatedSshKey(sshObj).then(
      () => {
        if (!sshObj.default) {
          // Switch to true
          this.Alerter.success(
            this.$translate.instant('user_ssh_default_on_success_message', {
              t0: sshObj.keyName,
            }),
            'userSsh',
          );
        } else {
          // Switch to false
          this.Alerter.success(
            this.$translate.instant('user_ssh_default_off_success_message'),
            'userSsh',
          );
        }
      },
      (err) => {
        this.Alerter.error(
          `${this.$translate.instant('user_ssh_default_error_message')} ${get(
            err,
            'message',
          ) || err}`,
          'userSsh',
        );
      },
    );
  }

  onCategoryFilterChanged() {
    this.getSshKeys();
  }

  getGuideUrl(language, guideName) {
    return (
      this.constants.urls[language].guides[guideName] ||
      this.constants.URLS.GB.guides[guideName]
    );
  }

  initGuides() {
    this.guidesLoading = true;
    return this.User.getUser()
      .then((user) => {
        this.guides = {
          sshCreate: this.getGuideUrl(user.ovhSubsidiary, 'sshCreate'),
          sshAdd: this.getGuideUrl(user.ovhSubsidiary, 'sshAdd'),
          sshChange: this.getGuideUrl(user.ovhSubsidiary, 'sshChange'),
        };
        this.user = user;
      })
      .catch((error) => {
        this.$log.error(error);
      })
      .finally(() => {
        this.guidesLoading = false;
      });
  }
}
