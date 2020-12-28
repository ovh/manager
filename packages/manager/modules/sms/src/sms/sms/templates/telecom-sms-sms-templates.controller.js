import get from 'lodash/get';
import pick from 'lodash/pick';

import addController from './add/telecom-sms-sms-templates-add.controller';
import addTemplate from './add/telecom-sms-sms-templates-add.html';
import editController from './edit/telecom-sms-sms-templates-edit.controller';
import editTemplate from './edit/telecom-sms-sms-templates-edit.html';
import relaunchController from './relaunch/telecom-sms-sms-templates-relaunch.controller';
import relaunchTemplate from './relaunch/telecom-sms-sms-templates-relaunch.html';
import removeController from './remove/telecom-sms-sms-templates-remove.controller';
import removeTemplate from './remove/telecom-sms-sms-templates-remove.html';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    $stateParams,
    $uibModal,
    goBack,
    OvhApiSms,
    TucSmsMediator,
    TucToast,
    TucToastError,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.$stateParams = $stateParams;
    this.$uibModal = $uibModal;
    this.api = {
      sms: {
        templates: OvhApiSms.Templates().v6(),
      },
    };
    this.goBack = goBack;
    this.TucSmsMediator = TucSmsMediator;
    this.TucToast = TucToast;
    this.TucToastError = TucToastError;

    this.templateItemModel = [
      'comment',
      'status',
      'name',
      'description',
      'activity',
      'message',
      'datetime',
    ];
  }

  $onInit() {
    this.loading = {
      init: false,
    };
    this.service = null;
    this.templates = {
      raw: null,
      paginated: [],
      orderBy: 'name',
      orderDesc: false,
      isLoading: false,
    };

    this.loading.init = true;
    return this.TucSmsMediator.initDeferred.promise
      .then(() => {
        this.service = this.TucSmsMediator.getCurrentSmsService();
        this.api.sms.templates
          .query({
            serviceName: this.$stateParams.serviceName,
          })
          .$promise.then((templates) => {
            this.templates.raw = templates.map((name) => ({ name }));
          });
      })
      .catch((err) => {
        this.TucToastError(err);
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  /**
   * Get details.
   * @param  {String} name
   * @return {Promise}
   */
  getDetails({ name }) {
    return this.api.sms.templates.get({
      serviceName: this.$stateParams.serviceName,
      name,
    }).$promise;
  }

  /**
   * Order templates' list.
   * @param  {String} by
   */
  orderBy(by) {
    if (this.templates.orderBy === by) {
      this.templates.orderDesc = !this.templates.orderDesc;
    } else {
      this.templates.orderBy = by;
    }
  }

  onTransformItemDone() {
    this.templates.isLoading = false;
  }

  /**
   * Refresh templates' list.
   * @return {Promise}
   */
  refresh() {
    this.api.sms.templates.resetCache();
    this.api.sms.templates.resetQueryCache();
    this.templates.paginated = [];
    this.templates.raw = null;
    this.templates.isLoading = true;
    return this.api.sms.templates
      .query({
        serviceName: this.$stateParams.serviceName,
      })
      .$promise.then((templates) => {
        this.templates.raw = templates.map((name) => ({ name }));
      })
      .catch((err) => {
        this.TucToastError(err);
      })
      .finally(() => {
        this.templates.isLoading = false;
      });
  }

  /**
   * Opens a modal to add a new template.
   */
  add() {
    const modal = this.$uibModal.open({
      animation: true,
      template: addTemplate,
      controller: addController,
      controllerAs: 'TemplateAddCtrl',
    });
    modal.result
      .then(() =>
        this.api.sms.templates
          .query({
            serviceName: this.$stateParams.serviceName,
          })
          .$promise.then((templates) => {
            this.templates.raw = templates.map((name) => ({ name }));
          }),
      )
      .catch((error) => {
        if (error && error.type === 'API') {
          this.TucToast.error(
            this.$translate.instant('sms_sms_templates_adding_ko', {
              error: get(error, 'msg.data.message'),
            }),
          );
        }
      });
  }

  /**
   * Opens a modal to edit a given template.
   * @param  {Object} template
   */
  edit(template) {
    const modal = this.$uibModal.open({
      animation: true,
      template: editTemplate,
      controller: editController,
      controllerAs: 'TemplateEditCtrl',
      resolve: { template: () => pick(template, this.templateItemModel) },
    });
    modal.result
      .then(() => this.refresh())
      .catch((error) => {
        if (error && error.type === 'API') {
          this.TucToast.error(
            this.$translate.instant('sms_sms_templates_editing_ko', {
              error: get(error, 'msg.data.message'),
            }),
          );
        }
      });
  }

  /**
   * Opens a modal to relaunch a given template.
   * @param  {Object} template
   */
  relaunch(template) {
    const modal = this.$uibModal.open({
      animation: true,
      template: relaunchTemplate,
      controller: relaunchController,
      controllerAs: 'TemplateRelaunchCtrl',
      resolve: { template: () => pick(template, this.templateItemModel) },
    });
    modal.result
      .then(() => this.refresh())
      .catch((error) => {
        if (error && error.type === 'API') {
          this.TucToast.error(
            this.$translate.instant('sms_sms_templates_relaunching_ko', {
              error: get(error, 'msg.data.message'),
            }),
          );
        }
      });
  }

  /**
   * Opens a modal to remove a given template.
   * @param  {Object} template
   */
  remove(template) {
    const modal = this.$uibModal.open({
      animation: true,
      template: removeTemplate,
      controller: removeController,
      controllerAs: '$ctrl',
      resolve: { template: () => pick(template, this.templateItemModel) },
    });
    modal.result
      .then(() =>
        this.api.sms.templates
          .query({
            serviceName: this.$stateParams.serviceName,
          })
          .$promise.then((templates) => {
            this.templates.raw = templates.map((name) => ({ name }));
          }),
      )
      .catch((error) => {
        if (error && error.type === 'API') {
          this.TucToast.error(
            this.$translate.instant('sms_sms_templates_removing_ko', {
              error: get(error, 'msg.data.message'),
            }),
          );
        }
      });
  }
}
