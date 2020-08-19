import get from 'lodash/get';
import map from 'lodash/map';
import snakeCase from 'lodash/snakeCase';
import some from 'lodash/some';

import {
  DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
} from './datacenter/drp/dedicatedCloud-datacenter-drp.constants';

angular.module('App').controller(
  'DedicatedCloudCtrl',
  class {
    /* @ngInject */
    constructor(
      $q,
      $scope,
      $stateParams,
      $timeout,
      $translate,
      $uibModal,
      coreConfig,
      currentDrp,
      currentUser,
      currentService,
      datacenterList,
      DedicatedCloud,
      drpGlobalStatus,
      goBackToDashboard,
      goToDrp,
      goToDrpDatacenterSelection,
      goToVpnConfiguration,
      isDrpActionPossible,
      OvhApiDedicatedCloud,
      User,
    ) {
      this.$q = $q;
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$timeout = $timeout;
      this.$translate = $translate;
      this.$uibModal = $uibModal;
      this.coreConfig = coreConfig;
      this.currentDrp = currentDrp;
      this.currentUser = currentUser;
      this.currentService = currentService;
      this.datacenterList = datacenterList;
      this.DedicatedCloud = DedicatedCloud;
      this.drpGlobalStatus = drpGlobalStatus;
      this.goBackToDashboard = goBackToDashboard;
      this.goToDrp = goToDrp;
      this.goToDrpDatacenterSelection = goToDrpDatacenterSelection;
      this.goToVpnConfiguration = goToVpnConfiguration;
      this.isDrpActionPossible = isDrpActionPossible;
      this.OvhApiDedicatedCloud = OvhApiDedicatedCloud;
      this.User = User;
      this.DRP_OPTIONS = DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS;
      this.DRP_STATUS = DEDICATEDCLOUD_DATACENTER_DRP_STATUS;
    }

    $onInit() {
      this.$scope.alerts = { dashboard: 'dedicatedCloud' };
      this.$scope.loadingInformations = true;
      this.$scope.loadingError = false;
      this.$scope.dedicatedCloud = null;

      this.$scope.allowDedicatedServerComplianceOptions =
        this.coreConfig.getRegion() !== 'US';

      this.$scope.dedicatedCloudDescription = {
        model: null,
        editMode: false,
        loading: false,
      };

      this.$scope.dedicatedCloud = {};

      this.$scope.$on('dedicatedcloud.informations.reload', () => {
        this.$scope.loadingInformations = true;
        this.$scope.loadDedicatedCloud();
      });

      this.$scope.$on('ovhAlert.show', (event, type, message) => {
        this.setMessage(message, { alertType: type });
      });

      this.$scope.$on('$locationChangeStart', () => {
        this.$scope.resetAction();
      });

      this.$scope.editDescription = (value) => this.editDescription(value);
      this.$scope.getRight = (order) => this.getRight(order);
      this.$scope.getUserAccessPolicyLabel = () =>
        this.getUserAccessPolicyLabel();
      this.$scope.loadDedicatedCloud = () => this.loadDedicatedCloud();
      this.$scope.setAction = (action, data) => this.setAction(action, data);
      this.$scope.setMessage = (message, data) =>
        this.setMessage(message, data);
      this.$scope.resetMessage = () => this.resetMessage();
      this.$scope.resetAction = () => this.resetAction();

      return this.loadDedicatedCloud();
    }

    loadUserInfo() {
      return this.User.getUser().then((user) => {
        this.$scope.dedicatedCloud.email = user.email;
      });
    }

    loadDedicatedCloud() {
      this.$scope.message = null;

      return this.$q.all([
        this.DedicatedCloud.getSelected(this.$stateParams.productId, true)
          .then((dedicatedCloud) => {
            Object.assign(this.$scope.dedicatedCloud, dedicatedCloud);
            this.$scope.dedicatedCloud.isExpired = dedicatedCloud.isExpired;

            if (this.$scope.dedicatedCloud.isExpired) {
              this.$scope.setMessage(
                this.$translate.instant('common_expired'),
                { type: 'cancelled' },
              );
              return;
            }

            this.$scope.dedicatedCloudDescription.model = angular.copy(
              this.$scope.dedicatedCloud.description,
            );

            this.loadUserInfo();
          })
          .catch((data) => {
            this.$scope.loadingError = true;
            this.$scope.setMessage(
              this.$translate.instant('dedicatedCloud_dashboard_loading_error'),
              { message: data.message, type: 'ERROR' },
            );
          })
          .finally(() => {
            this.$scope.loadingInformations = false;
          }),
        this.DedicatedCloud.getDescription(this.$stateParams.productId).then(
          (dedicatedCloudDescription) => {
            Object.assign(
              this.$scope.dedicatedCloud,
              dedicatedCloudDescription,
            );
          },
        ),
        this.OvhApiDedicatedCloud.v6()
          .getServiceInfos({
            serviceName: this.$stateParams.productId,
          })
          .$promise.then((serviceInformations) => {
            this.$scope.dedicatedCloud.serviceInfos = serviceInformations;
          }),
      ]);
    }

    editDescription(value) {
      return this.$uibModal
        .open({
          animation: true,
          templateUrl: 'components/name-edition/name-edition.html',
          controller: 'NameEditionCtrl',
          controllerAs: '$ctrl',
          resolve: {
            data: () => ({
              contextTitle: 'dedicatedCloud_description',
              productId: this.$stateParams.productId,
              successText: this.$translate.instant(
                'dedicatedCloud_dashboard_nameModifying_success',
              ),
              value,
            }),
          },
        })
        .result.then((newDescription) => {
          this.$scope.dedicatedCloud.description = newDescription;
        });
    }

    getRight(order) {
      return this.$scope.dedicatedCloud
        ? $.inArray(order, this.$scope.dedicatedCloud.orderRight) === -1
        : false;
    }

    // Action + message
    resetAction() {
      this.$scope.setAction(false);
    }

    setMessage(message, data) {
      let messageToSend = message;

      if (!data && !this.$scope.dedicatedCloud.isExpired) {
        this.$scope.message = messageToSend;
        return;
      }

      let errorType = '';
      if (data.type && !(data.idTask || data.taskId)) {
        errorType = data.type;
      } else if (data.state) {
        errorType = data.state;
      }

      if (data.alertType) {
        this.$scope.alertType = data.alertType;
      } else {
        switch (errorType.toLowerCase()) {
          case 'blocked':
          case 'cancelled':
          case 'paused':
          case 'error':
            this.$scope.alertType = 'alert-danger';
            break;
          case 'waiting_ack':
          case 'waitingack':
          case 'doing':
          case 'warning':
          case 'partial':
            this.$scope.alertType = 'alert-warning';
            break;
          case 'todo':
          case 'done':
          case 'info':
          case 'ok':
            this.$scope.alertType = 'alert-success';
            break;
          default:
            this.$scope.alertType = 'alert-success';
            break;
        }
      }

      if (data.message) {
        messageToSend += ` (${data.message})`;
      } else if (some(data.messages)) {
        const messageParts = map(
          data.messages,
          (_message) => `${_message.id} : ${_message.message}`,
        );
        messageToSend = ` (${messageParts.join(', ')})`;
      }

      this.$scope.message = messageToSend;
    }

    resetMessage() {
      this.$scope.message = null;
    }

    setAction(action, data) {
      if (action) {
        this.$scope.currentAction = action;
        this.$scope.currentActionData = data;

        this.$scope.stepPath = `dedicatedCloud/${this.$scope.currentAction}.html`;

        $('#currentAction').modal({
          keyboard: true,
          backdrop: 'static',
        });
      } else {
        $('#currentAction').modal('hide');
        this.$scope.currentActionData = null;
        this.$timeout(() => {
          this.$scope.stepPath = '';
        }, 300);
      }
    }

    getUserAccessPolicyLabel() {
      const policy = get(this.$scope, 'dedicatedCloud.userAccessPolicy');

      if (policy) {
        return this.$translate.instant(
          `dedicatedCloud_user_access_policy_${snakeCase(
            policy,
          ).toUpperCase()}`,
        );
      }

      return '-';
    }
  },
);
