import angular from 'angular';
import get from 'lodash/get';
import map from 'lodash/map';

import addController from './add/telecom-sms-users-add.controller';
import addTemplate from './add/telecom-sms-users-add.html';
import templatesController from './templates/telecom-sms-users-templates.controller';
import templatesTemplate from './templates/telecom-sms-users-templates.html';
import changePasswordController from './change-password/telecom-sms-users-change-password.controller';
import changePasswordTemplate from './change-password/telecom-sms-users-change-password.html';
import quotaController from './quota/telecom-sms-users-quota.controller';
import quotaTemplate from './quota/telecom-sms-users-quota.html';
import limitController from './limit/telecom-sms-users-limit.controller';
import limitTemplate from './limit/telecom-sms-users-limit.html';
import restrictController from './restrict/telecom-sms-users-restrict.controller';
import restrictTemplate from './restrict/telecom-sms-users-restrict.html';
import callbackController from './callback/telecom-sms-users-callback.controller';
import callbackTemplate from './callback/telecom-sms-users-callback.html';
import removeController from './remove/telecom-sms-users-remove.controller';
import removeTemplate from './remove/telecom-sms-users-remove.html';

export default class {
  /* @ngInject */
  constructor(
    $stateParams,
    $q,
    $filter,
    $uibModal,
    $translate,
    OvhApiSms,
    TucSmsMediator,
    TucToast,
    TucToastError,
  ) {
    this.$filter = $filter;
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.api = {
      sms: OvhApiSms.v6(),
      smsUsers: OvhApiSms.Users().v6(),
    };
    this.TucSmsMediator = TucSmsMediator;
    this.TucToast = TucToast;
    this.TucToastError = TucToastError;
  }

  $onInit() {
    this.service = null;
    this.users = {
      raw: null,
      paginated: null,
      sorted: null,
      orderBy: 'login',
      orderDesc: false,
      isLoading: false,
    };
    this.refresh().then(() => {
      this.service = this.TucSmsMediator.getCurrentSmsService();
    });
  }

  /**
   * Refresh all sms api users list.
   * @return {Promise}
   */
  refresh() {
    this.api.smsUsers.resetAllCache();
    this.users.isLoading = true;
    return this.fetchUsers()
      .then((users) => {
        this.users.raw = angular.copy(users);
        this.sortUsers();
      })
      .catch((err) => {
        this.TucToastError(err);
      })
      .finally(() => {
        this.users.isLoading = false;
      });
  }

  /**
   * Fetch all sms api users.
   * @return {Promise}
   */
  fetchUsers() {
    return this.api.smsUsers
      .query({
        serviceName: this.$stateParams.serviceName,
      })
      .$promise.then((loginIds) =>
        this.$q.all(
          map(
            loginIds,
            (login) =>
              this.api.smsUsers.get({
                serviceName: this.$stateParams.serviceName,
                login,
              }).$promise,
          ),
        ),
      );
  }

  /**
   * Sort sms api users.
   */
  sortUsers() {
    let data = angular.copy(this.users.raw);
    data = this.$filter('orderBy')(
      data,
      this.users.orderBy,
      this.users.orderDesc,
    );
    this.users.sorted = data;
  }

  /**
   * Order sms api user list.
   * @param  {String} by
   */
  orderBy(by) {
    if (this.users.orderBy === by) {
      this.users.orderDesc = !this.users.orderDesc;
    } else {
      this.users.orderBy = by;
    }
    this.sortUsers();
  }

  /**
   * Opens a modal to add a sms api user.
   */
  add() {
    const modal = this.$uibModal.open({
      animation: true,
      template: addTemplate,
      controller: addController,
      controllerAs: 'UsersAddCtrl',
    });
    modal.result
      .then(() => this.refresh())
      .catch((error) => {
        if (error && error.type === 'API') {
          this.TucToast.error(
            this.$translate.instant('sms_users_add_user_ko', {
              error: get(error, 'msg.data.message'),
            }),
          );
        }
      });
  }

  /**
   * Opens a modal to manager templates.
   */
  templates() {
    const modal = this.$uibModal.open({
      animation: true,
      template: templatesTemplate,
      controller: templatesController,
      controllerAs: 'UsersTemplatesCtrl',
      resolve: { service: () => this.service },
    });
    modal.result
      .then(() =>
        this.api.sms
          .get({
            serviceName: this.$stateParams.serviceName,
          })
          .$promise.then((service) => {
            this.service = service;
          })
          .catch((error) => this.TucToastError(error)),
      )
      .catch((error) => {
        if (error && error.type === 'API') {
          this.TucToast.error(
            this.$translate.instant('sms_users_templates_update_ko', {
              error: get(error, 'msg.data.message'),
            }),
          );
        }
      });
  }

  /**
   * Opens a modal to change password for a given sms api user.
   * @param  {Ressource} user An api user.
   */
  changePassword(user) {
    const modal = this.$uibModal.open({
      animation: true,
      template: changePasswordTemplate,
      controller: changePasswordController,
      controllerAs: '$ctrl',
      resolve: { user: () => user },
    });
    modal.result
      .then(() => this.refresh())
      .catch((error) => {
        if (error && error.type === 'API') {
          this.TucToast.error(
            this.$translate.instant('sms_users_change_password_user_ko', {
              error: get(error, 'msg.data.message'),
            }),
          );
        }
      });
  }

  /**
   * Opens a modal to set quota for a given sms api user.
   * @param  {Ressource} user An api user.
   */
  quota(user) {
    const modal = this.$uibModal.open({
      animation: true,
      template: quotaTemplate,
      controller: quotaController,
      controllerAs: 'UsersQuotaCtrl',
      resolve: {
        params: () => {
          const params = {
            user,
            service: this.service,
          };
          return params;
        },
      },
    });
    modal.result
      .then(() => this.refresh())
      .catch((error) => {
        if (error && error.type === 'API') {
          this.TucToast.error(
            this.$translate.instant('sms_users_quota_user_ko', {
              error: get(error, 'msg.data.message'),
            }),
          );
        }
      });
  }

  /**
   * Opens a modal to set limit for a given sms api user.
   * @param  {Ressource} user An api user.
   */
  limit(user) {
    const modal = this.$uibModal.open({
      animation: true,
      template: limitTemplate,
      controller: limitController,
      controllerAs: 'UsersLimitCtrl',
      resolve: { user: () => user },
    });
    modal.result
      .then(() => this.refresh())
      .catch((error) => {
        if (error && error.type === 'API') {
          this.TucToast.error(
            this.$translate.instant('sms_users_limit_user_ko', {
              error: get(error, 'msg.data.message'),
            }),
          );
        }
      });
  }

  /**
   * Opens a modal to set restrict for a given sms api user.
   * @param  {Ressource} user An api user.
   */
  restrict(user) {
    const modal = this.$uibModal.open({
      animation: true,
      template: restrictTemplate,
      controller: restrictController,
      controllerAs: 'UsersRestrictByIpCtrl',
      resolve: { user: () => user },
    });
    modal.result
      .then(() => this.refresh())
      .catch((error) => {
        if (error && error.type === 'API') {
          this.TucToast.error(
            this.$translate.instant('sms_users_restrict_user_ko', {
              error: get(error, 'msg.data.message'),
            }),
          );
        }
      });
  }

  /**
   * Opens a modal to set callback URL for a given sms api user.
   * @param  {Ressource} user An api user.
   */
  callback(user) {
    const modal = this.$uibModal.open({
      animation: true,
      template: callbackTemplate,
      controller: callbackController,
      controllerAs: 'UsersCallbackCtrl',
      resolve: { user: () => user },
    });
    modal.result
      .then(() => this.refresh())
      .catch((error) => {
        if (error && error.type === 'API') {
          this.TucToast.error(
            this.$translate.instant('sms_users_callback_user_ko', {
              error: get(error, 'msg.data.message'),
            }),
          );
        }
      });
  }

  /**
   * Opens a modal to remove a given sms api user.
   * @param  {Ressource} user An api user.
   */
  remove(user) {
    const modal = this.$uibModal.open({
      animation: true,
      template: removeTemplate,
      controller: removeController,
      controllerAs: 'UsersRemoveCtrl',
      resolve: { user: () => user },
    });
    modal.result
      .then(() => this.refresh())
      .catch((error) => {
        if (error && error.type === 'API') {
          this.TucToast.error(
            this.$translate.instant('sms_users_remove_user_ko', {
              error: get(error, 'msg.data.message'),
            }),
          );
        }
      });
  }
}
