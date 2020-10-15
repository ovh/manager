import map from 'lodash/map';

import { TRUNK_PACK_DETAILS } from './trunk.constants';

export default class TelecomTelephonyLineTrunkSimultaneousLines {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $translate,
    currentLine,
    TucChartjsFactory,
    tucDebounce,
    OvhApiTelephony,
    OvhApiOrderTelephony,
    TucToast,
  ) {
    'ngInject';

    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;

    this.currentLine = currentLine;
    this.TucChartjsFactory = TucChartjsFactory;
    this.tucDebounce = tucDebounce;
    this.OvhApiTelephony = OvhApiTelephony;
    this.OvhApiOrderTelephony = OvhApiOrderTelephony;
    this.TucToast = TucToast;

    this.getNewRepartition = tucDebounce(
      () => this._getNewRepartition(),
      500,
      false,
    );
  }

  _getNewRepartition() {
    if (
      this.trunkRates.change.quantityWanted > 0 &&
      this.trunkRates.change.quantityWanted !==
        this.trunkRates.change.quantityOptimized
    ) {
      this.trunkRates.change.loading = true;
      return this.OvhApiTelephony.Trunk()
        .v6()
        .getChannelsPacksRepartition({
          billingAccount: this.$stateParams.billingAccount,
          serviceName: this.$stateParams.serviceName,
          quantity: this.trunkRates.change.quantityWanted,
        })
        .$promise.then((packResult) => {
          this.trunkRates.change.price =
            packResult.totalPrice.text +
            this.$translate.instant(
              'telephony_line_actions_line_calls_trunk_simultaneous_channels_price_per_month',
            );
          this.trunkRates.change.packsRepartition = packResult.packsRepartition;
          this.trunkRates.change.quantityOptimized =
            packResult.optimizedChannelsQuantity;

          this.buildChart();
          this.calculateBandwidth();

          return packResult;
        })
        .catch((error) => {
          this.TucToast.error(
            this.$translate.instant(
              'telephony_line_actions_line_calls_trunk_simultaneous_new_get_channels_error',
            ),
          );
          return error;
        })
        .finally(() => {
          this.trunkRates.change.loading = false;
        });
    }

    return this.$q.when(null);
  }

  buildChart() {
    const dataOffset = 0.1;
    this.chart = new this.TucChartjsFactory(
      angular.copy(TRUNK_PACK_DETAILS.chart),
    );

    this.chart.data.labels = map(
      this.trunkRates.current.packsRepartition,
      (pack) =>
        this.$translate.instant(
          'telephony_line_actions_line_calls_trunk_simultaneous_chart_channels_label',
          { count: pack.channels },
        ),
    );
    this.chart.data.datasets.push(
      {
        data: map(
          this.trunkRates.current.packsRepartition,
          (pack) => pack.quantity + dataOffset,
        ),
        backgroundColor: '#113f6d',
        label: this.$translate.instant(
          'telephony_line_actions_line_calls_trunk_simultaneous_chart_legend_current',
        ),
      },
      {
        data: map(
          this.trunkRates.change.packsRepartition,
          (pack) => pack.quantity + dataOffset,
        ),
        backgroundColor: '#00a2bf',
        label: this.$translate.instant(
          'telephony_line_actions_line_calls_trunk_simultaneous_chart_legend_new',
        ),
      },
    );

    if (this.trunkRates.pending.packsRepartition.length) {
      this.chart.data.datasets.push({
        data: map(
          this.trunkRates.pending.packsRepartition,
          (pack) => pack.quantity + dataOffset,
        ),
        backgroundColor: '#ff9803',
        label: this.$translate.instant(
          'telephony_line_actions_line_calls_trunk_simultaneous_chart_legend_pending',
        ),
      });
    }
  }

  calculateBandwidth() {
    const bandwidthRate = 70;
    this.trunkRates.change.bandwidth =
      bandwidthRate * this.trunkRates.change.quantityOptimized;
  }

  canOrder() {
    return (
      this.trunkRates.change.quantityOptimized > 0 &&
      this.trunkRates.change.quantityWanted > 0
    );
  }

  $onInit() {
    if (!this.currentLine) {
      this.TucToast.error(
        this.$translate.instant(
          'telephony_line_actions_line_calls_simultaneous_line_load_error',
        ),
      );
      return this.$q.when(null);
    }

    this.chart = null;

    this.trunkRates = {
      current: {
        quantity: this.currentLine.simultaneousLinesDetails.current,
        price: null,
        packsRepartition: [],
      },
      change: {
        bandwidth: '--',
        price: null,
        packsRepartition: [
          { quantity: 0 },
          { quantity: 0 },
          { quantity: 0 },
          { quantity: 0 },
        ],
        quantityWanted: null,
        quantityOptimized: null,
      },
      loading: false,
      order: null,
      pending: {
        quantity:
          this.currentLine.simultaneousLinesDetails.current -
          this.currentLine.simultaneousLinesDetails.toBeDeleted,
        price: null,
        packsRepartition: [],
      },
    };

    this.trunkRates.loading = true;

    return this.OvhApiTelephony.Trunk()
      .v6()
      .getChannelsPacksRepartition({
        billingAccount: this.$stateParams.billingAccount,
        serviceName: this.$stateParams.serviceName,
        quantity: this.trunkRates.current.quantity,
      })
      .$promise.then((packResult) => {
        this.trunkRates.current.price =
          packResult.totalPrice.text +
          this.$translate.instant(
            'telephony_line_actions_line_calls_trunk_simultaneous_channels_price_per_month',
          );
        this.trunkRates.current.packsRepartition = packResult.packsRepartition;

        if (this.currentLine.simultaneousLinesDetails.toBeDeleted > 0) {
          return this.OvhApiTelephony.Trunk()
            .v6()
            .getChannelsPacksRepartition({
              billingAccount: this.$stateParams.billingAccount,
              serviceName: this.$stateParams.serviceName,
              quantity: this.trunkRates.pending.quantity,
            })
            .$promise.then((pendingPack) => {
              this.trunkRates.pending.price =
                pendingPack.totalPrice.text +
                this.$translate.instant(
                  'telephony_line_actions_line_calls_trunk_simultaneous_channels_price_per_month',
                );
              this.trunkRates.pending.packsRepartition =
                pendingPack.packsRepartition;

              this.buildChart();
              return pendingPack;
            })
            .catch((error) => {
              this.TucToast.error(
                this.$translate.instant(
                  'telephony_line_actions_line_calls_trunk_simultaneous_pending_channels_get_channels_error',
                ),
              );
              return this.$q.reject(error);
            });
        }

        this.buildChart();
        return packResult;
      })
      .catch((error) => {
        this.TucToast.error(
          this.$translate.instant(
            'telephony_line_actions_line_calls_trunk_simultaneous_current_channels_get_channels_error',
          ),
        );
        return this.$q.reject(error);
      })
      .finally(() => {
        this.trunkRates.loading = false;
      });
  }

  orderPacks() {
    this.trunkRates.loading = true;
    return this.OvhApiOrderTelephony.v6()
      .orderSimultaneousTrunkLines(
        {
          serviceName: this.$stateParams.serviceName,
        },
        { quantity: this.trunkRates.change.quantityOptimized },
      )
      .$promise.then((packOrder) => {
        this.trunkRates.order = packOrder;
      })
      .catch((error) => {
        this.TucToast.error(
          [
            this.$translate.instant(
              'telephony_line_actions_line_calls_trunk_simultaneous_new_channels_update_error',
            ),
            error.data.message,
          ].join(' '),
        );
        return error;
      })
      .finally(() => {
        this.trunkRates.loading = false;
      });
  }
}
