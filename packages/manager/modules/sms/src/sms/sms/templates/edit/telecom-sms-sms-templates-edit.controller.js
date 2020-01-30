import angular from 'angular';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $timeout,
    $translate,
    $uibModalInstance,
    OvhApiSms,
    TucSmsMediator,
    template,
    TucToastError,
  ) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$uibModalInstance = $uibModalInstance;
    this.api = {
      sms: {
        templates: OvhApiSms.Templates().v6(),
      },
    };
    this.TucSmsMediator = TucSmsMediator;
    this.template = template;
    this.TucToastError = TucToastError;
  }

  $onInit() {
    this.loading = {
      init: false,
      edit: false,
    };
    this.edited = false;
    this.model = {
      template: angular.copy(this.template),
    };
    this.availableActivities = [];
    this.attributes = ['name', 'activity', 'description', 'message', 'status'];

    this.loading.init = true;
    return this.TucSmsMediator.getApiScheme()
      .then((schema) => {
        this.availableActivities = schema.models['sms.TypeTemplateEnum'].enum;
      })
      .catch((err) => {
        this.TucToastError(err);
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  /**
   * Edit templates.
   * @return {Promise}
   */
  edit() {
    this.loading.edit = true;
    return this.$q
      .all([
        this.api.sms.templates.edit(
          {
            serviceName: this.$stateParams.serviceName,
            name: this.model.template.name,
          },
          this.model.template,
        ).$promise,
        this.$timeout(angular.noop, 1000),
      ])
      .then(() => {
        this.loading.add = false;
        this.edited = true;
        return this.$timeout(() => this.close(), 1500);
      })
      .catch((error) =>
        this.cancel({
          type: 'API',
          msg: error,
        }),
      );
  }

  cancel(message) {
    return this.$uibModalInstance.dismiss(message);
  }

  close() {
    return this.$uibModalInstance.close(true);
  }

  /**
   * Has changed helper.
   * @return {Boolean}
   */
  hasChanged() {
    return !isEqual(
      pick(this.model.template, this.attributes),
      pick(this.template, this.attributes),
    );
  }
}
