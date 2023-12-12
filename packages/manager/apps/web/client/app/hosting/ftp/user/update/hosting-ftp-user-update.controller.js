import get from 'lodash/get';
import { CONNECTION_PROTOCOLS } from '../../hosting-ftp-constants';

angular.module('App').controller(
  'HostingFtpUserUpdateCtrl',
  class HostingFtpUserUpdateCtrl {
    constructor(
      $scope,
      $stateParams,
      $translate,
      Alerter,
      Hosting,
      HostingUser,
    ) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.Hosting = Hosting;
      this.HostingUser = HostingUser;
      this.CONNECTION_PROTOCOLS = CONNECTION_PROTOCOLS;
    }

    $onInit() {
      this.classes = {
        homeInvalid: '',
      };
      this.model = {
        user: this.$scope.currentActionData.user,
        userLogin: this.$scope.currentActionData.user.login,
        os: {
          LINUX: 'linux',
          WINDOWS: 'windows',
        },
        capabilities: null,
        operatingSystem: this.$scope.currentActionData.ftpInformations
          .operatingSystem,
      };

      this.connectionProtocol = [
        this.model.user.state,
        this.model.user.sshState,
      ].join('_');
      this.$scope.updateUser = () => this.updateUser();
      this.$scope.onNextStep = () => this.goToSecondStep();

      this.HostingUser.getUserCreationCapabilities()
        .then((capabilities) => {
          this.model.capabilities = capabilities;
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'hosting_tab_FTP_configuration_user_modify_step1_loading_error',
            ),
            get(err, 'data', err),
            this.$scope.alerts.main,
          );
        });
    }

    isPathValid() {
      return this.Hosting.constructor.isPathValid(this.model.user.home);
    }

    isStep1Valid() {
      return this.model.user.state !== null && this.isPathValid();
    }

    getSelectedHome() {
      let home;
      if (this.model.user.home !== null) {
        if (
          /^\/.*/.test(this.model.user.home) ||
          this.model.user.isPrimaryAccount
        ) {
          return this.model.user.home;
        }
        return `./${this.model.user.home}`;
      }
      return home;
    }

    goToSecondStep() {
      [
        this.model.user.state,
        this.model.user.sshState,
      ] = this.connectionProtocol.split('_');
    }

    updateUser() {
      this.$scope.resetAction();
      const user = angular.copy(this.model.user);
      delete user.isPrimaryAccount;

      return this.HostingUser.updateUser(this.$stateParams.productId, {
        login: this.model.userLogin,
        data: user,
      })
        .then(() => {
          this.Alerter.success(
            this.$translate.instant(
              'hosting_tab_FTP_configuration_user_modify_success',
            ),
            this.$scope.alerts.main,
          );
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'hosting_tab_FTP_configuration_user_modify_fail',
            ),
            err,
            this.$scope.alerts.main,
          );
        });
    }
  },
);
