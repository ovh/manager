import assign from 'lodash/assign';
import includes from 'lodash/includes';
import set from 'lodash/set';

import confirmationTemplate from './confirmation/template.html';
import confirmationController from './confirmation/controller';

import infoTemplate from './info/template.html';
import infoController from './info/controller';

import nameChangeTemplate from './name-change/template.html';
import nameChangeController from './name-change/controller';

import warningTemplate from './warning/template.html';
import warningController from './warning/controller';

export default class CucControllerModalHelper {
  /* @ngInject */
  constructor($q, $translate, $uibModal) {
    this.$q = $q;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.unhandledError = ['backdrop click', 'escape key press'];
  }

  showModal(config = {}) {
    const modalConfig = assign(
      {
        windowTopClass: 'cui-modal',
      },
      config.modalConfig,
    );
    const modalInstance = this.$uibModal.open(modalConfig);

    const deferred = this.$q.defer();
    modalInstance.result
      .then((result) => {
        if (config.successHandler) {
          config.successHandler(result);
        }
        deferred.resolve(result);
      })
      .catch((err) => {
        // We check for backdrop click as error.
        // It happens when we click a button behind the modal.
        // We don't want an error message for that.
        if (!includes(this.unhandledError, err)) {
          if (config.errorHandler) {
            config.errorHandler(err);
          }
          deferred.reject(err);
        }
      });

    return deferred.promise;
  }

  showWarningModal(config = {}) {
    return this.showModal({
      modalConfig: {
        template: warningTemplate,
        controller: warningController,
        controllerAs: '$ctrl',
        resolve: {
          params: () => config,
        },
      },
    });
  }

  showInfoModal(config = {}) {
    return this.showModal({
      modalConfig: {
        template: infoTemplate,
        controller: infoController,
        controllerAs: '$ctrl',
        resolve: {
          params: () => config,
        },
      },
    });
  }

  showConfirmationModal(config = {}) {
    return this.showModal({
      modalConfig: {
        template: confirmationTemplate,
        controller: confirmationController,
        controllerAs: '$ctrl',
        resolve: {
          params: () => config,
        },
      },
    });
  }

  showNameChangeModal(config = {}, modalConfig = {}) {
    return this.showModal({
      modalConfig: assign({}, modalConfig, {
        template: nameChangeTemplate,
        controller: nameChangeController,
        controllerAs: '$ctrl',
        resolve: {
          params: () => config,
        },
      }),
    });
  }

  showDeleteModal(config = {}) {
    set(
      config,
      'submitButtonText',
      config.submitButtonText || this.$translate.instant('cuc_helper_delete'),
    );
    return this.showConfirmationModal(config);
  }
}
