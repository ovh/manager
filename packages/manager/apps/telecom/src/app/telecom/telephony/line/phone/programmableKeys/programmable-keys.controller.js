import clone from 'lodash/clone';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
import set from 'lodash/set';
import isString from 'lodash/isString';

import editTemplate from './edit/edit.html';
import editController from './edit/edit.controller';

import {
  ALPHA_NUMERIC_REGEXP,
  COMPLEX_NUMERIC_REGEXP,
} from './programmable-keys.constants';

export default class TelecomTelephonyLinePhoneProgammableKeysCtrl {
  /* @ngInject */
  constructor(
    $stateParams,
    $translate,
    $uibModal,
    TelephonyMediator,
    tucTelephonyBulk,
    TucToast,
  ) {
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.TelephonyMediator = TelephonyMediator;
    this.tucTelephonyBulk = tucTelephonyBulk;
    this.TucToast = TucToast;
  }

  $onInit() {
    this.loading = {
      init: true,
      keys: false,
    };

    this.hasPhone = false;
    this.order = {
      by: 'keyNum',
      desc: false,
    };

    this.functionKeys = {
      raw: null,
      paginated: null,
    };

    this.bulkDatas = {
      infos: {
        name: 'functionKeys',
        actions: [
          {
            name: '',
          },
        ],
      },
    };

    return this.initLines();
  }

  initLines() {
    return this.TelephonyMediator.getGroup(this.$stateParams.billingAccount)
      .then((group) => {
        this.group = group;
        this.line = this.group.getLine(this.$stateParams.serviceName);

        return this.getPhone();
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  orderBy(by) {
    if (this.order.by === by) {
      this.order.desc = !this.order.desc;
    } else {
      this.order.by = by;
    }
  }

  edit(functionKey) {
    const modal = this.$uibModal.open({
      animation: true,
      template: editTemplate,
      controller: editController,
      controllerAs: 'ProgammableKeysEditCtrl',
      resolve: {
        functionKey() {
          return functionKey;
        },
      },
    });

    modal.result.then(
      () => this.getPhone(),
      (error) => {
        if (error && error.type === 'API') {
          this.TucToast.error(
            this.$translate.instant(
              'telephony_line_phone_programmableKeys_save_error',
              { error: error.msg },
            ),
          );
        }
        return this.getPhone();
      },
    );

    return modal;
  }

  /* -----  End of INITIALIZATION  ------*/

  getPhone() {
    return this.line.getPhone().then(() => {
      if (this.line.hasPhone) {
        return this.line.phone.initDeffered().then(() => {
          const re = /^SUP[0-9]$/;
          this.functionKeys.raw = this.line.phone.functionKeys.map(
            (functionKey) => {
              const key = clone(functionKey);
              if (isString(key.function) && key.function.match(re)) {
                const line = find(this.group.lines, {
                  serviceName: key.parameter,
                });
                if (line) {
                  key.parameterLabel = `${line.description} (${key.parameter})`;
                }
              }
              const customLabel = find(this.line.phone.configurations, {
                name: `KeyLabel${key.keyNum}`,
              });
              if (customLabel) {
                key.customLabel = customLabel.value;
              }
              return key;
            },
          );
          this.functionKeys.raw.sort(this.constructor.sortFunctionKeys);
        });
      }
      return null;
    });
  }

  static sortFunctionKeys(functionKeyA, functionKeyB) {
    const [alphaA, numericA] = functionKeyA.label.match(ALPHA_NUMERIC_REGEXP);
    const [alphaB, numericB] = functionKeyB.label.match(ALPHA_NUMERIC_REGEXP);
    if (alphaA === alphaB) {
      const [numericA1, numericA2] = numericA.match(COMPLEX_NUMERIC_REGEXP);
      const [numericB1, numericB2] = numericB.match(COMPLEX_NUMERIC_REGEXP);

      if (numericA1 === numericB1) {
        return parseInt(numericA2, 10) > parseInt(numericB2, 10) ? 1 : -1;
      }

      return parseInt(numericA, 10) > parseInt(numericB, 10) ? 1 : -1;
    }

    return alphaA > alphaB ? 1 : -1;
  }

  /* ===========================
  =            BULK            =
  ============================ */

  getBulkParams() {
    this.bulkDatas.infos.actions = this.buildBulkActions();
  }

  buildBulkActions() {
    return map(this.functionKeys.raw, (key) => ({
      name: 'functionKey',
      route: '/telephony/{billingAccount}/line/{serviceName}/phone/functionKey/{keyNum}'.replace(
        '{keyNum}',
        key.keyNum,
      ),
      method: 'PUT',
      params: {
        function: key.function,
        parameter: key.parameter,
      },
    }));
  }

  /* eslint-disable class-methods-use-this */
  filterServices(services) {
    const filteredServices = filter(
      services,
      (service) => ['sip', 'mgcp'].indexOf(service.featureType) > -1,
    );

    return filter(filteredServices, (service) =>
      find(services, {
        serviceName: service.serviceName,
        billingAccount: service.billingAccount,
      }),
    );
  }
  /* eslint-enable class-methods-use-this */

  onBulkSuccess() {
    return (bulkResult) => {
      if (bulkResult.error.length) {
        set(
          bulkResult,
          'error',
          map(bulkResult.error, (error) => {
            const errorDetails = get(error, 'errors[0]');
            set(
              error,
              'errors[0].error',
              errorDetails.statusCode === 501
                ? this.$translate.instant(
                    'telephony_line_phone_programmableKeys_bulk_error_details',
                  )
                : errorDetails.error,
            );

            return error;
          }),
        );
      }

      // display message of success or error
      this.tucTelephonyBulk
        .getTucToastInfos(
          bulkResult,
          {
            fullSuccess: this.$translate.instant(
              'telephony_line_phone_programmableKeys_bulk_all_success',
            ),
            partialSuccess: this.$translate.instant(
              'telephony_line_phone_programmableKeys_bulk_some_success',
              {
                count: bulkResult.success.length,
              },
            ),
            error: this.$translate.instant(
              'telephony_line_phone_programmableKeys_bulk_error',
            ),
          },
          true,
        )
        .forEach((toastInfo) => {
          this.TucToast[toastInfo.type](toastInfo.message, {
            hideAfter: null,
          });
        });

      // reset initial values to be able to modify again the options
      this.TelephonyMediator.resetAllCache();
      return this.initLines();
    };
  }

  onBulkError() {
    return (error) =>
      this.TucToast.error(
        [
          this.$translate.instant(
            'telephony_line_phone_programmableKeys_bulk_on_error',
          ),
          get(error, 'msg.data'),
        ].join(' '),
      );
  }

  /* -----  End of BULK  ------ */
}
