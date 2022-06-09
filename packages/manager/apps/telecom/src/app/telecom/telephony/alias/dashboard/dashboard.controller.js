import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import isEmpty from 'lodash/isEmpty';
import keys from 'lodash/keys';
import round from 'lodash/round';
import set from 'lodash/set';
import sortBy from 'lodash/sortBy';
import sumBy from 'lodash/sumBy';
import union from 'lodash/union';

import { TELEPHONY_ALIAS_CONSUMPTION } from './dashboard.constants';
import { OBSOLETE_FEATURE_TYPES } from '../alias.constants';

import confirmDeleteConfigurationTemplate from './confirmDeleteConfiguration/confirm-delete-configuration.html';
import confirmDeleteConfigurationController from './confirmDeleteConfiguration/confirm-delete-configuration.controller';

export default class TelecomTelephonyAliasHomeController {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $stateParams,
    $translate,
    $uibModal,
    atInternet,
    OvhApiTelephony,
    TucChartjsFactory,
    TucToast,
    tucVoipService,
    tucVoipServiceAlias,
    TelephonyMediator,
    URLS,
    isSvaWalletFeatureAvailable,
    svaWallet,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.atInternet = atInternet;
    this.OvhApiTelephony = OvhApiTelephony;
    this.TucChartjsFactory = TucChartjsFactory;
    this.TucToast = TucToast;
    this.tucVoipService = tucVoipService;
    this.tucVoipServiceAlias = tucVoipServiceAlias;
    this.TelephonyMediator = TelephonyMediator;

    this.URLS = URLS;

    this.isSvaWalletFeatureAvailable = isSvaWalletFeatureAvailable;
    this.svaWallet = svaWallet;

    this.billingAccount = $stateParams.billingAccount;
    this.serviceName =
      $stateParams.serviceName !== 'default' ? $stateParams.serviceName : null;
  }

  $onInit() {
    this.showSvaProfile = false;

    this.alias = null;
    this.consumption = {
      incoming: {},
      outgoing: {},
      chart: new this.TucChartjsFactory(
        angular.copy(TELEPHONY_ALIAS_CONSUMPTION.chart),
      ),
    };

    return this.fetchService().then(() => {
      if (this.isSvaWalletFeatureAvailable && this.svaWallet) {
        this.tucVoipServiceAlias
          .isSpecialNumber(this.alias)
          .then((isSpecial) => {
            if (isSpecial) {
              this.showSvaProfile = true;
            }
          });
      }
    });
  }

  fetchService() {
    this.loading = true;
    return this.tucVoipService
      .fetchSingleService(this.billingAccount, this.serviceName)
      .then((alias) => {
        if (alias) {
          this.alias = alias;
          this.featureTypeLabel = this.$translate.instant(
            `telephony_alias_configuration_configuration_type_${this.alias.featureType}`,
          );

          return this.tucVoipService
            .getServiceDirectory(alias)
            .then((directory) => {
              this.alias.directory = directory;

              return this.$q
                .all({
                  consumption: this.hasConsumption()
                    ? this.fetchServiceConsumption()
                    : angular.noop(),
                  redirectionInformations: ['ddi', 'redirect'].includes(
                    this.alias.featureType,
                  )
                    ? this.fetchRedirectionInfo()
                    : angular.noop(),
                })
                .then(({ redirectionInformations }) => {
                  if (redirectionInformations) {
                    this.redirectionInformations =
                      redirectionInformations.description ||
                      redirectionInformations.serviceName;
                  } else {
                    this.redirectionInformations = this.$translate.instant(
                      'common_none',
                    );
                  }
                });
            });
        }
        return null;
      })
      .catch((error) => {
        this.TucToast.error(
          `${this.$translate.instant('telephony_alias_load_error')} ${get(
            error,
            'data.message',
            error.message,
          )}`,
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  fetchRedirectionInfo() {
    return this.tucVoipServiceAlias
      .fetchRedirectNumber(
        {
          billingAccount: this.alias.billingAccount,
          serviceName: this.alias.serviceName,
        },
        this.alias.featureType,
      )
      .then(
        ({ destination }) =>
          destination && this.TelephonyMediator.findService(destination),
      )
      .catch((error) => error);
  }

  fetchServiceConsumption() {
    function transformIncomingCallsData(calls) {
      return calls
        .filter((call) => call.wayType !== 'outgoing')
        .map((call) => {
          set(call, 'durationAsDate', new Date(call.duration * 1000));
          return call;
        });
    }

    function transformOutgoingCallsData(calls) {
      return calls
        .filter((call) => call.wayType !== 'incoming' && call.duration > 0)
        .map((call) => {
          set(call, 'durationAsDate', new Date(call.duration * 1000));
          return call;
        });
    }

    return this.tucVoipService
      .getServiceConsumption(this.alias)
      .then((conso) => {
        const incomingCalls = transformIncomingCallsData(conso);
        const outgoingCalls = transformOutgoingCallsData(conso);

        this.consumption.incoming = {
          total: incomingCalls.length,
          duration: new Date(
            sumBy(incomingCalls, (call) => call.duration) * 1000,
          ),
        };

        this.consumption.outgoing = {
          total: outgoingCalls.length,
          duration: new Date(
            sumBy(outgoingCalls, (call) => call.duration) * 1000,
          ),
          outplan: round(
            sumBy(
              outgoingCalls.filter(
                (call) => call.planType === 'outplan' && call.priceWithoutTax,
              ),
              (call) => call.priceWithoutTax.value,
            ),
            2,
          ),
        };

        this.buildConsumptionChart(incomingCalls, outgoingCalls);
        return conso;
      });
  }

  buildConsumptionChart(incomingCalls, outgoingCalls) {
    const datasetConfiguration = {
      dataset: {
        fill: true,
        borderWidth: 1,
      },
    };

    const _incomingCalls = incomingCalls.map((call) => ({
      callDate: moment(call.creationDatetime)
        .format('YYYY-MM-DD')
        .toString(),
    }));

    const _outgoingCalls = outgoingCalls.map((call) => ({
      callDate: moment(call.creationDatetime)
        .format('YYYY-MM-DD')
        .toString(),
    }));

    const xAxisKeys = keys(
      groupBy(
        sortBy(union(_incomingCalls, _outgoingCalls), 'callDate'),
        'callDate',
      ),
    );

    function convertCallsToChartData(calls) {
      const groupedCalls = groupBy(calls, 'callDate');

      return xAxisKeys.map((key) => ({
        x: key,
        y: groupedCalls[key] ? groupedCalls[key].length : 0,
      }));
    }

    if (isEmpty(xAxisKeys)) {
      this.consumption.chart.options.scales.xAxes = [];
    } else {
      this.consumption.chart.addSerie(
        this.$translate.instant('telephony_alias_consumption_outgoing_calls'),
        convertCallsToChartData(_outgoingCalls),
        datasetConfiguration,
      );

      this.consumption.chart.addSerie(
        this.$translate.instant('telephony_alias_consumption_incoming_calls'),
        convertCallsToChartData(_incomingCalls),
        datasetConfiguration,
      );
    }
  }

  deleteConfiguration() {
    this.$uibModal
      .open({
        template: confirmDeleteConfigurationTemplate,
        controller: confirmDeleteConfigurationController,
        controllerAs: '$ctrl',
        backdrop: 'static',
        resolve: {
          number: this.alias,
          isObsolete: () => this.isFeatureTypeObsolete(),
        },
      })
      .result.then(() => {
        this.OvhApiTelephony.Service()
          .v6()
          .resetCache();
        this.$state.reload();
        this.TucToast.success(
          this.$translate.instant('telephony_alias_delete_ok'),
        );
      })
      .catch((error) => {
        if (error) {
          this.TucToast.error(
            `${this.$translate.instant('telephony_alias_delete_ko')} ${get(
              error,
              'data.message',
              error.message,
            )}`,
          );
        }
      });
  }

  groupNumberByFeatureType() {
    switch (this.alias.featureType) {
      case 'contactCenterSolution':
      case 'esayHunting':
      case 'miniPabx':
        return 'easyHunting';
      case 'ddi':
      case 'easyPabx':
      case 'redirect':
        return 'redirect';
      default:
        return this.alias.featureType;
    }
  }

  hasConsumption() {
    const typesWithoutConsumption = ['redirect', 'ddi', 'conference', 'empty'];
    return !typesWithoutConsumption.includes(this.alias.featureType);
  }

  hasExpertMode() {
    const expertTypes = ['svi', 'contactCenterSolutionExpert', 'cloudHunting'];
    return expertTypes.includes(this.alias.featureType);
  }

  redirectToChangeTypePage() {
    return this.$state
      .go(
        'telecom.telephony.billingAccount.alias.details.configuration.changeType',
      )
      .then(() =>
        this.atInternet.trackClick({
          name: 'telecom::telephony::alias::dashboard::choose_configuration',
          type: 'action',
        }),
      );
  }

  isFeatureTypeObsolete() {
    return OBSOLETE_FEATURE_TYPES.includes(this.alias.featureType);
  }
}
