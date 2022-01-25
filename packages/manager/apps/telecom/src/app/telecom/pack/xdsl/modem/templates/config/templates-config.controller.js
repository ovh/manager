import chunk from 'lodash/chunk';
import flatten from 'lodash/flatten';
import isArray from 'lodash/isArray';
import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import XdslModemTemplateConfigModalCtrl from './modal/pack-xdsl-modem-template-config-modal.controller';

export default class XdslModemTemplateConfigCtrl {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $translate,
    $uibModal,
    OvhApiXdsl,
    TucToast,
    TucToastError,
  ) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.OvhApiXdsl = OvhApiXdsl;
    this.TucToast = TucToast;
    this.TucToastError = TucToastError;
    this.errors = {
      template: false,
    };
  }

  /*= =====================================
      =            INITIALIZATION            =
      ====================================== */
  $onInit() {
    this.templates = null;
    this.loaders = {};
    return this.fetchTemplates()
      .then((result) => {
        this.templates = result;
      })
      .catch((err) => this.TucToastError(err));
  }

  /* -----  End of INITIALIZATION  ------*/

  fetchTemplates() {
    this.loaders.template = true;
    this.OvhApiXdsl.TemplateModem()
      .v6()
      .resetAllCache();
    return this.OvhApiXdsl.TemplateModem()
      .v6()
      .query()
      .$promise.then((names) =>
        this.$q
          .all(
            map(
              chunk(names, 50),
              (chunkNames) =>
                this.OvhApiXdsl.TemplateModem()
                  .v6()
                  .getBatch({
                    name: chunkNames,
                  }).$promise,
            ),
          )
          .then((chunkResult) => {
            this.loaders.template = false;
            const templates = flatten(chunkResult).map(
              ({ error, key, value }) => {
                if (value !== null) {
                  return { name: key, detail: value };
                }
                return {
                  name: key,
                  detail: {
                    capabilities: null,
                    info: this.$translate.instant(
                      'xdsl_modem_template_config_table_is_empty',
                    ),
                    creationDate: '',
                    DHCP: [],
                    LAN: [],
                    WLAN: [],
                    dmzIP: null,
                    mtuSize: null,
                    parametersToIgnore: null,
                    portMapping: [],
                  },
                  error,
                };
              },
            );
            return templates;
          }),
      );
  }

  setSelectedTemplate(template) {
    this.template = template;
    if (this.template.detail.capabilities) {
      this.convertCapabilities(
        JSON.parse(this.template.detail.capabilities),
        this.template.detail.parametersToIgnore,
        true,
      );
    } else {
      this.parametersToIgnore = {
        mtuSize: false,
        dmzIP: false,
        LANandDHCP: false,
      };
    }

    if (this.parametersToIgnore.dmzIP) {
      this.template.detail.dmzIP = this.$translate.instant(
        'xdsl_modem_template_config_no_value',
      );
    }
    if (this.parametersToIgnore.mtuSize) {
      this.template.detail.mtuSize = this.$translate.instant(
        'xdsl_modem_template_config_no_value',
      );
    }

    if (this.template.detail.WLAN) {
      // Add ignore column to set parameters to ignore
      this.template.detail.WLAN = this.template.detail.WLAN.map((row) => ({
        ...row,
        ignore:
          isArray(this.parametersToIgnore.WLANList) &&
          this.parametersToIgnore.WLANList.includes(row.wifiName),
      }));
    }

    if (this.template.detail.portMapping) {
      this.template.detail.portMapping = this.template.detail.portMapping.map(
        (row) => ({
          ...row,
          ignore:
            isArray(this.parametersToIgnore.portMappingList) &&
            this.parametersToIgnore.portMappingList.includes(row.name),
        }),
      );
    }
  }

  convertCapabilities(capabilities, paramsToIgnore, isParametersToIgnore) {
    const parametersToIgnore = {
      mtuSize: capabilities?.mtuSize ? !capabilities.mtuSize : '',
      dmzIP: capabilities?.dmzIP ? !capabilities.dmzIP : '',
      LANandDHCP: capabilities?.LANandDHCP ? !capabilities.LANandDHCP : '',
    };
    if (capabilities) {
      this.isDisabled = {
        mtuSize: !capabilities.mtuSize,
        dmzIP: !capabilities.dmzIP,
        LANandDHCP: !capabilities.LANandDHCP,
      };
    }
    if (isParametersToIgnore) {
      if (paramsToIgnore) {
        this.parametersToIgnore = paramsToIgnore;
      } else {
        this.parametersToIgnore = parametersToIgnore;
      }
    }
    return parametersToIgnore;
  }

  displayModal(title, question) {
    return this.$uibModal.open({
      animation: true,
      templateUrl:
        'app/telecom/pack/xdsl/modem/templates/config/modal/pack-xdsl-modem-template-config-modal.html',
      controller: XdslModemTemplateConfigModalCtrl,
      controllerAs: '$ctrl',
      resolve: {
        data: () => ({
          title,
          question,
        }),
      },
    });
  }

  deleteSelectedTemplate({ name }) {
    const modal = this.displayModal(
      this.$translate.instant('xdsl_modem_template_config_modal_title_delete'),
      this.$translate.instant(
        'xdsl_modem_template_config_modal_question_delete',
        { templateName: name },
      ),
    );

    modal.result.then(() =>
      this.OvhApiXdsl.TemplateModem()
        .v6()
        .deleteTemplate({
          name,
        })
        .$promise.then(() => this.fetchTemplates())
        .then((data) => {
          this.templates = data;
        })
        .then(() =>
          this.TucToast.success(
            this.$translate.instant(
              'xdsl_modem_template_config_delete_success',
            ),
          ),
        )
        .catch(() => {
          this.TucToast.error(
            this.$translate.instant('xdsl_modem_template_config_delete_error'),
          );
        }),
    );
  }

  cancelConfig() {
    this.template = null;
  }

  hasConfigChange() {
    // check if parametersToIgnore changed
    const params = this.convertCapabilities(
      JSON.parse(this.template.detail.capabilities),
    );
    return !isEqual(this.parametersToIgnore, params);
  }

  onRowSelectWifi(wifiName) {
    if (this.parametersToIgnore.WLANList == null) {
      this.parametersToIgnore.WLANList = [];
    }
    const index = this.parametersToIgnore.WLANList.indexOf(wifiName);
    if (index === -1) {
      this.parametersToIgnore.WLANList.push(wifiName);
    } else {
      this.parametersToIgnore.WLANList.splice(index, 1);
    }
  }

  onRowSelectPortMapping(name) {
    if (this.parametersToIgnore.portMappingList == null) {
      this.parametersToIgnore.portMappingList = [];
    }
    const index = this.parametersToIgnore.portMappingList.indexOf(name);
    if (index === -1) {
      this.parametersToIgnore.portMappingList.push(name);
    } else {
      this.parametersToIgnore.portMappingList.splice(index, 1);
    }
  }

  updateTemplate() {
    const modal = this.displayModal(
      this.$translate.instant('xdsl_modem_template_config_modal_title_update'),
      this.$translate.instant(
        'xdsl_modem_template_config_modal_question_update',
        { templateName: this.template.name },
      ),
    );

    const paramsToIgnore = {};
    // check parameters to ignore to set
    if (!this.isDisabled.LANandDHCP) {
      paramsToIgnore.LANandDHCP = this.parametersToIgnore.LANandDHCP;
    }
    if (!this.isDisabled.dmzIP) {
      paramsToIgnore.dmzIP = this.parametersToIgnore.dmzIP;
    }
    if (!this.isDisabled.mtuSize) {
      paramsToIgnore.mtuSize = this.parametersToIgnore.mtuSize;
    }
    paramsToIgnore.WLANList = this.parametersToIgnore.WLANList;
    paramsToIgnore.portMappingList = this.parametersToIgnore.portMappingList;

    return modal.result.then(() =>
      this.OvhApiXdsl.TemplateModem()
        .v6()
        .updateTemplate(
          {
            name: this.template.name,
          },
          {
            parametersToIgnore: paramsToIgnore,
          },
        )
        .$promise.then(() => {
          // Display list templates
          this.template = null;
        })
        .then(() => this.fetchTemplates())
        .then((data) => {
          this.templates = data;
        })
        .then(() =>
          this.TucToast.success(
            this.$translate.instant(
              'xdsl_modem_template_config_update_success',
            ),
          ),
        )
        .catch(() => {
          this.TucToast.error(
            this.$translate.instant('xdsl_modem_template_config_update_error'),
          );
        }),
    );
  }
}
