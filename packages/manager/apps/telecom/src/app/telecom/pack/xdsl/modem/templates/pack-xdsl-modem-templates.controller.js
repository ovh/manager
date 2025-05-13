import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { PACK_XDSL_MODEM_TEMPLATE } from './pack-xdsl-modem-template.constant';

export default class XdslModemTemplateCtrl {
  /* @ngInject */
  constructor(
    $stateParams,
    $translate,
    $uibModal,
    OvhApiXdsl,
    TucPackXdslModemMediator,
    TucToast,
  ) {
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.mediator = TucPackXdslModemMediator;
    this.OvhApiXdsl = OvhApiXdsl;
    this.templateName = null;
    this.TucToast = TucToast;
    this.TEMPLATE_CONSTANT = PACK_XDSL_MODEM_TEMPLATE;
  }

  /*= =====================================
      =            INITIALIZATION            =
      ====================================== */
  $onInit() {
    return this.getModemTemplates();
  }
  /* -----  End of INITIALIZATION  ------*/

  getModemTemplates() {
    return this.OvhApiXdsl.TemplateModem()
      .v6()
      .query()
      .$promise.then((templateModemIds) => {
        this.modemTemplates = templateModemIds;
        return templateModemIds;
      })
      .catch(() => {
        this.modemTemplates = [];
      })
      .finally(() => {
        this.templateTmp = '';
        this.template = '';
      });
  }

  createModemTemplate() {
    this.message = {};
    return this.OvhApiXdsl.TemplateModem()
      .v6()
      .post(
        {},
        {
          name: this.templateName,
          serviceName: this.$stateParams.serviceName,
        },
      )
      .$promise.then(() => {
        this.mediator.setTask('createModemTemplate');
        this.message = {
          type: 'success',
          detail: this.$translate.instant('xdsl_modem_template_creation_doing'),
        };
        this.templateName = null;
        this.getModemTemplates();
      })
      .catch((err) => {
        let errorMessage = '';
        if (
          err.data.message.includes(this.TEMPLATE_CONSTANT.errors.duplicate)
        ) {
          errorMessage = this.$translate.instant(
            'xdsl_modem_template_name_already_exist',
            { templateName: this.templateName },
          );
        } else if (
          err.data.message.includes(this.TEMPLATE_CONSTANT.errors.invalid)
        ) {
          errorMessage = this.$translate.instant(
            'xdsl_modem_template_invalid_name',
            { templateName: this.templateName },
          );
        } else {
          errorMessage = this.$translate.instant(
            'xdsl_modem_template_an_error_ocurred',
          );
        }
        this.message = {
          type: 'error',
          detail: errorMessage,
        };
        if (err.data?.message.includes(this.TEMPLATE_CONSTANT.errors.modemWifi) || err.data?.message.includes(this.TEMPLATE_CONSTANT.errors.serviceNotFound)) {
          this.message.reason = err.data?.message;
        }
      });
  }

  applyTemplate() {
    if (isEmpty(this.$stateParams.serviceName) || !this.templateTmp) {
      this.templateTmp = this.template;
      this.TucToast.error(
        this.$translate.instant('xdsl_modem_template_an_error_ocurred'),
      );
    }
    this.loading = true;
    return this.OvhApiXdsl.v6()
      .applyTemplate(
        {
          xdslId: this.$stateParams.serviceName,
        },
        {
          templateName: this.templateTmp,
        },
      )
      .$promise.then(() => {
        this.mediator.disableCapabilities();
        this.mediator.setTask('applyTemplateModemConfig');
        this.template = this.templateTmp;
        this.TucToast.success(
          this.$translate.instant('xdsl_modem_template_apply_doing'),
        );
      })
      .catch((err) => {
        this.templateTmp = this.template;
        this.TucToast.error(
          [
            this.$translate.instant('xdsl_modem_template_an_error_ocurred'),
            get(err, 'data.message', ''),
          ].join(' '),
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
