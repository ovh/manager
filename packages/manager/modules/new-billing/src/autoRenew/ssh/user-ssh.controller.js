import get from 'lodash/get';

import {
  SSH_CREATE_GUIDES,
  SSH_ADD_GUIDES,
  SSH_CHANGE_GUIDES,
} from './user-ssh-guides';

export default class UserAccountSshCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $q,
    $timeout,
    $translate,
    UseraccountSshService,
    constants,
    coreConfig,
    $log,
    Alerter,
  ) {
    this.$scope = $scope;
    this.$q = $q;
    this.$translate = $translate;
    this.UseraccountSshService = UseraccountSshService;
    this.constants = constants;
    this.coreConfig = coreConfig;
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

  onCategoryFilterChanged() {
    this.getSshKeys();
  }

  initGuides() {
    this.user = this.coreConfig.getUser();
    this.guides = {
      sshCreate: get(
        SSH_CREATE_GUIDES,
        this.user.ovhSubsidiary,
        SSH_CREATE_GUIDES.FR,
      ),
      sshAdd: get(SSH_ADD_GUIDES, this.user.ovhSubsidiary, SSH_ADD_GUIDES.FR),
      sshChange: get(
        SSH_CHANGE_GUIDES,
        this.user.ovhSubsidiary,
        SSH_CHANGE_GUIDES.FR,
      ),
    };
  }
}
