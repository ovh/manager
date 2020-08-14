import get from 'lodash/get';
import head from 'lodash/head';
import isArray from 'lodash/isArray';

export default class ExchangeLicenseHistoryCtrl {
  /* @ngInject */
  constructor(
    $scope,
    WucChartjsFactory,
    wucExchange,
    exchangeAccountTypes,
    exchangeHeaderLicence,
    messaging,
    navigation,
    $translate,
  ) {
    this.$scope = $scope;

    this.WucChartjsFactory = WucChartjsFactory;
    this.wucExchange = wucExchange;
    this.exchangeAccountTypes = exchangeAccountTypes;
    this.exchangeHeaderLicence = exchangeHeaderLicence;
    this.messaging = messaging;
    this.navigation = navigation;
    this.$translate = $translate;
  }

  $onInit() {
    this.$routerParams = this.wucExchange.getParams();
    this.selectedPeriod = this.exchangeHeaderLicence.PERIODS.LAST_MONTH;

    this.$scope.loadMonitoring = () => this.loadMonitoring();
  }

  loadMonitoring() {
    this.loading = true;

    return this.exchangeHeaderLicence
      .fetchLicences(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.selectedPeriod.date,
      )
      .then((licenses) => {
        this.chart = new this.WucChartjsFactory({
          type: 'line',
          data: {
            datasets: [],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              position: 'bottom',
              display: true,
            },
            elements: {
              point: {
                radius: 0,
              },
            },
            tooltips: {
              mode: 'index',
              intersect: false,
              callbacks: {
                title: (data) => get(head(data), 'xLabel'),
              },
            },
            scales: {
              yAxes: [
                {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  scaleLabel: {
                    display: true,
                  },
                  gridLines: {
                    drawBorder: true,
                    display: true,
                  },
                  ticks: {
                    beginAtZero: true,
                    stepSize: 1,
                    suggestedMax: licenses.maxValue + 1,
                  },
                },
              ],
              xAxes: [
                {
                  type: 'time',
                  position: 'bottom',
                  gridLines: {
                    drawBorder: true,
                    display: false,
                  },
                },
              ],
            },
          },
        });

        const serieOptions = {
          dataset: {
            fill: false,
            borderWidth: 1,
          },
        };

        this.chart.addSerie(
          this.$translate.instant(
            'exchange_action_license_history_type_outlook',
          ),
          licenses.outlook,
          serieOptions,
        );

        if (isArray(licenses.standard)) {
          this.chart.addSerie(
            this.$translate.instant('exchange_action_license_history_label', {
              t0: this.exchangeAccountTypes.getDisplayValue(
                this.exchangeAccountTypes.TYPES.STANDARD,
              ),
            }),
            licenses.standard,
            serieOptions,
          );
        }

        if (isArray(licenses.basic)) {
          this.chart.addSerie(
            this.$translate.instant('exchange_action_license_history_label', {
              t0: this.exchangeAccountTypes.getDisplayValue(
                this.exchangeAccountTypes.TYPES.BASIC,
              ),
            }),
            licenses.basic,
            serieOptions,
          );
        }

        if (isArray(licenses.enterprise)) {
          this.chart.addSerie(
            this.$translate.instant('exchange_action_license_history_label', {
              t0: this.exchangeAccountTypes.getDisplayValue(
                this.exchangeAccountTypes.TYPES.ENTERPRISE,
              ),
            }),
            licenses.enterprise,
            serieOptions,
          );
        }
      })
      .catch((error) => {
        this.navigation.resetAction();
        this.messaging.writeError(
          this.$translate.instant('exchange_action_license_history_fail'),
          error,
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
