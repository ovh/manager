import find from 'lodash/find';
import get from 'lodash/get';
import has from 'lodash/has';
import head from 'lodash/head';

export default class TelecomTelephonyAliasSpecialRsvaCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $stateParams,
    $translate,
    costs,
    OvhApiOrder,
    tucTelephonyBulk,
    TucToast,
    tucVoipService,
    tucVoipServiceAlias,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.costs = costs;
    this.OvhApiOrder = OvhApiOrder;
    this.tucTelephonyBulk = tucTelephonyBulk;
    this.TucToast = TucToast;
    this.tucVoipService = tucVoipService;
    this.tucVoipServiceAlias = tucVoipServiceAlias;
  }

  $onInit() {
    this.serviceInfos = {
      billingAccount: this.$stateParams.billingAccount,
      serviceName: this.$stateParams.serviceName,
    };

    this.tariffBearingPrice = `${this.costs.rsva.tariffBearing.value} ${this.costs.rsva.tariffBearing.currencySymbol}`;
    this.initializeBulkData();

    this.loading = true;
    return this.$q
      .all({
        directory: this.tucVoipService.getServiceDirectory(this.serviceInfos),
        rateCodeInfos: this.getRateCodeInformations(this.serviceInfos),
        rsvaInfos: this.tucVoipServiceAlias.getRSVAInformations(
          this.serviceInfos,
        ),
        schema: this.OvhApiOrder.v6().schema().$promise,
      })
      .then(({ directory, rateCodeInfos, rsvaInfos, schema }) => {
        this.rateCodeInfos = rateCodeInfos.rateCodeInfos;
        this.directory = directory;

        this.allowedRateCodes = rateCodeInfos.allowedRateCodes;
        this.currentRateCode = rateCodeInfos.currentRateCode;

        this.rateCode = this.allowedRateCodes.find(
          ({ code }) => code === this.currentRateCode.rateCode,
        );
        this.pricingType =
          this.rateCode.pricePerMinuteWithoutTax.value > 0 ? 'minute' : 'call';
        this.updateRateCodesByType();

        this.scheduledRateCode = rateCodeInfos.scheduledRateCode;

        if (this.scheduledRateCode) {
          this.tariffBearingPrice = this.scheduledRateCode
            .updateRateCodePriceWithoutTax.value
            ? this.scheduledRateCode.updateRateCodePriceWithoutTax.text
            : this.tariffBearingPrice;
        }

        if (has(schema, "models['telephony.NumberSpecialTypologyEnum'].enum")) {
          this.regExp = new RegExp(`^${directory.country}_`);
          this.typologies = schema.models[
            'telephony.NumberSpecialTypologyEnum'
          ].enum
            .filter((element) => element.match(this.regExp))
            .map((typology) => ({
              value: typology,
              displayValue: `${this.$translate.instant(
                `telephony_alias_special_rsva_infos_typology_${typology.replace(
                  this.regExp,
                  '',
                )}_label`,
              )}`,
            }));

          this.typology = find(this.typologies, {
            value: `${directory.country}_${rsvaInfos.typology.replace(
              directory.country,
              '',
            )}`,
          });
          this.copyTypology = angular.copy(this.typology);
        }
      })
      .catch((error) => {
        this.TucToast.error(
          `${this.$translate.instant(
            'telephony_alias_special_rsva_loading_error',
          )} ${get(error, 'data.message', error.message)}`,
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  getRateCodeInformations() {
    return this.$q.all({
      allowedRateCodes: this.tucVoipServiceAlias.getAllowedRateCodes(
        this.serviceInfos,
      ),
      currentRateCode: this.tucVoipServiceAlias.getCurrentRateCode(
        this.serviceInfos,
      ),
      scheduledRateCode: this.tucVoipServiceAlias.getScheduledRateCode(
        this.serviceInfos,
      ),
    });
  }

  initializeBulkData() {
    this.bulkData = {
      infos: {
        name: 'rsva',
        actions: [
          {
            name: 'rsvaUpdate',
            route: '/telephony/{billingAccount}/rsva/{serviceName}',
            method: 'PUT',
            params: null,
          },
          {
            name: 'scheduleRateCode',
            route:
              '/telephony/{billingAccount}/rsva/{serviceName}/scheduleRateCode',
            method: 'POST',
            params: null,
          },
        ],
      },
    };
  }

  updateRateCodesByType() {
    this.availableRateCodes = this.allowedRateCodes.filter(
      ({ pricePerMinuteWithoutTax, pricePerCallWithoutTax }) =>
        this.pricingType === 'minute'
          ? pricePerMinuteWithoutTax.value > 0
          : pricePerCallWithoutTax.value > 0,
    );

    if (this.availableRateCodes.length > 0) {
      this.rateCode =
        this.availableRateCodes.find(
          ({ code }) => code === this.currentRateCode.rateCode,
        ) || head(this.availableRateCodes);
    } else {
      // If some rate codes are messy (no price), we add the current rate code for display purpose
      this.availableRateCodes.push(this.rateCode);
    }
  }

  onChangeTariffBearing() {
    this.rateCodeChanged = !angular.equals(
      this.rsva.rateCode,
      this.rsvaForm.rateCode,
    );
    return this.rateCodeChanged;
  }

  hasChangedRateCode() {
    return (
      !angular.equals(this.rateCode.code, this.currentRateCode.rateCode) &&
      this.tariffBearingChangeAgreed
    );
  }

  hasChanged() {
    return (
      this.hasChangedRateCode() ||
      !angular.equals(this.typology, this.copyTypology)
    );
  }

  applyChanges() {
    this.loading = true;

    return this.$q
      .all({
        rateCode: this.hasChangedRateCode()
          ? this.tucVoipServiceAlias.updateRateCode(
              this.serviceInfos,
              this.rateCode.code,
            )
          : this.$q.when(),
        typology: this.tucVoipServiceAlias.updateTypology(
          this.serviceInfos,
          this.typology.value.replace(this.regExp, ''),
        ),
      })
      .then(() =>
        this.$state.go('^').then(() => {
          this.TucToast.success(
            this.$translate.instant('telephony_alias_special_rsva_success'),
          );
        }),
      )
      .catch((error) => {
        this.TucToast.error(
          `${this.$translate.instant(
            'telephony_alias_special_rsva_error',
          )} ${get(error, 'data.message', error.message)}`,
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  /* =====================================
  =                  BULK                =
  ====================================== */

  filterServices() {
    return (services) =>
      this.$q
        .allSettled(
          services.map(({ billingAccount, serviceName }) =>
            this.tucVoipServiceAlias.getCurrentRateCode({
              billingAccount,
              serviceName,
            }),
          ),
        )
        .then((result) => result)
        .catch((result) => result)
        .then((promises) =>
          promises
            .map((promise, index) =>
              ![400, 404].includes(promise.status) ? services[index] : null,
            )
            .filter((promise) => promise),
        );
  }

  getBulkParams() {
    return (action) =>
      action === 'scheduleRateCode'
        ? { rateCode: get(this.rateCode, 'code', '') }
        : { typology: this.typology.value.replace(this.regExp, '') };
  }

  onBulkSuccess() {
    return (bulkResult) => {
      // display message of success or error
      this.tucTelephonyBulk
        .getTucToastInfos(bulkResult, {
          fullSuccess: this.$translate.instant(
            'telephony_alias_special_rsva_bulk_all_success',
          ),
          partialSuccess: this.$translate.instant(
            'telephony_alias_special_rsva_bulk_some_success',
            {
              count: bulkResult.success.length,
            },
          ),
          error: this.$translate.instant(
            'telephony_alias_special_rsva_bulk_error',
          ),
        })
        .forEach((toastInfo) => {
          this.TucToast[toastInfo.type](toastInfo.message, {
            hideAfter: null,
          });
        });

      this.OvhApiTelephonyService.v6().resetCache();
      this.OvhApiTelephony.Rsva()
        .v6()
        .resetCache();
      this.$onInit();
    };
  }

  onBulkError() {
    return (error) => {
      this.TucToast.error(
        `${this.$translate.instant(
          'telephony_alias_special_rsva_bulk_on_error',
        )} ${get(error, 'data.message', error.message)}`,
      );
    };
  }
}
