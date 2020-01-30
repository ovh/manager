import last from 'lodash/last';
import map from 'lodash/map';
import max from 'lodash/max';
import maxBy from 'lodash/maxBy';

angular
  .module('managerApp')
  .controller(
    'CloudProjectComputeInfrastructureVirtualMachineMonitoringCtrl',
    function CloudProjectComputeInfrastructureVirtualMachineMonitoringCtrl(
      $rootScope,
      $scope,
      $q,
      $timeout,
      CloudProjectComputeInfrastructureOrchestrator,
      OvhApiCloudProjectInstance,
      CLOUD_MONITORING,
      CLOUD_UNIT_CONVERSION,
    ) {
      const self = this;

      self.vm = null;

      this.loaders = {
        monitoring: {
          'cpu:used': false,
          'mem:used': false,
          'net:rx': false,
          'net:tx': false,
        },
      };

      this.dataPeriod = {
        cpu: {
          max: undefined,
          needUpgrade: undefined,
        },
        mem: {
          max: undefined,
          needUpgrade: undefined,
        },
        net: {
          up: {
            max: undefined,
            needUpgrade: undefined,
          },
          down: {
            max: undefined,
            needUpgrade: undefined,
          },
        },
      };

      self.accordions = {
        cpu: false,
        mem: false,
        net: false,
      };

      self.chartData = {
        'cpu:used': null,
        'mem:used': null,
        'net:rx': null,
        'net:tx': null,
      };

      // list of available periods to select for monitoring chart
      self.chartPeriodEnum = ['lastday', 'lastweek', 'lastmonth', 'lastyear'];

      // currently selected period for each monitoring chart
      self.selectedChartPeriod = {
        'cpu:used': 'lastweek',
        'mem:used': 'lastweek',
        'net:rx': 'lastweek',
        'net:tx': 'lastweek',
      };

      self.close = function close() {
        self.vm.stopMonitoring();
        $rootScope.$broadcast(
          'cuc-highlighted-element.hide',
          `compute,${self.vm.id}`,
        );
      };

      self.openVmFlavorEditionState = function openVmFlavorEditionState() {
        CloudProjectComputeInfrastructureOrchestrator.setEditVmParam('FLAVOR');
        CloudProjectComputeInfrastructureOrchestrator.turnOnVmEdition(self.vm);
      };

      function getDefaultScale(rawData) {
        return {
          divisionScale: 1,
          unit: rawData.unit,
        };
      }

      function scaleData(rawData) {
        const maxValue = max(
          map(rawData.values, (timeSerie) => timeSerie.value),
        );
        let divisionScale;
        let unit;

        if (maxValue / CLOUD_UNIT_CONVERSION.GIGABYTE_TO_BYTE >= 1) {
          divisionScale = CLOUD_UNIT_CONVERSION.GIGABYTE_TO_BYTE;
          unit = 'gb/s';
        } else if (maxValue / CLOUD_UNIT_CONVERSION.MEGABYTE_TO_BYTE >= 1) {
          divisionScale = CLOUD_UNIT_CONVERSION.MEGABYTE_TO_BYTE;
          unit = 'mb/s';
        } else if (maxValue / CLOUD_UNIT_CONVERSION.KILOBYTE_TO_BYTE >= 1) {
          divisionScale = CLOUD_UNIT_CONVERSION.KILOBYTE_TO_BYTE;
          unit = 'kb/s';
        } else {
          divisionScale = 1;
          unit = 'b/s';
        }

        return {
          divisionScale,
          unit,
        };
      }

      // get a good timescale to display values over a given period
      function getPeriodTimeScale(period) {
        switch (period) {
          case 'lastday':
            return { unit: 'hours', amount: 2, format: '%Hh' };
          case 'lastweek':
            return { unit: 'days', amount: 1, format: '%d/%m' };
          case 'lastmonth':
            return { unit: 'weeks', amount: 1, format: '%d/%m' };
          case 'lastyear':
            return { unit: 'months', amount: 1, format: '%m' };
          default:
            return { unit: 'days', amount: 1, format: '%Hh' };
        }
      }

      function getPeriodStart(period) {
        const oneDay = 1000 * 60 * 60 * 24; // in ms
        switch (period) {
          case 'lastday':
            return new Date().getTime() - oneDay;
          case 'lastweek':
            return new Date().getTime() - 7 * oneDay;
          case 'lastmonth':
            return new Date().getTime() - 31 * oneDay;
          case 'lastyear':
            return new Date().getTime() - 365 * oneDay;
          default:
            return null;
        }
      }

      // updates monitoring chart with given data from api
      function updateChart(type, period, rawData) {
        let scaledData;

        scaledData = getDefaultScale(rawData);

        if (type === 'net:rx' || type === 'net:tx') {
          scaledData = scaleData(rawData);
        }

        const { divisionScale, unit } = scaledData;

        const data = map(rawData.values, (e) => ({
          timestamp: e.timestamp * 1000, // unix to js timestamp
          value: e.value / divisionScale,
        }));
        if (data.length) {
          const chartData = {
            data,
            ymin: 0,
            xmin: getPeriodStart(period),
            xmax: new Date().getTime(),
            unit,
            margin: {
              top: 10,
              left: 55,
              bottom: 30,
              right: 10,
            },
            timeScale: getPeriodTimeScale(period),
          };
          if (
            type === 'mem:used' &&
            self.vm.monitoringData &&
            self.vm.monitoringData.mem &&
            self.vm.monitoringData.mem.total
          ) {
            chartData.ymax = self.vm.monitoringData.mem.total.value;
          }
          self.chartData[type] = chartData;
        }
      }

      function closeOnEscapeKey(evt) {
        if (evt.which === 27) {
          self.close();
        }
        $scope.$apply();
      }

      function updateMaxCPUPercentageForPeriod(data) {
        self.dataPeriod.cpu.max = maxBy(data.values, (v) =>
          angular.isNumber(v.value) ? v.value : Number.NEGATIVE_INFINITY,
        ).value;
        self.dataPeriod.cpu.needUpgrade =
          self.dataPeriod.cpu.max >= CLOUD_MONITORING.vm.upgradeAlertThreshold;
        self.accordions.cpu =
          self.accordions.cpu || self.dataPeriod.cpu.needUpgrade;
      }

      function updateMaxRAMPercentageForPeriod(data) {
        const total = last(self.vm.monitoringData.raw['mem:max'].values).value;
        const maxUsed = maxBy(data.values, (v) =>
          angular.isNumber(v.value) ? v.value : Number.NEGATIVE_INFINITY,
        ).value;
        self.dataPeriod.mem.max = (maxUsed / total) * 100;
        self.dataPeriod.mem.needUpgrade =
          self.dataPeriod.mem.max >= CLOUD_MONITORING.vm.upgradeAlertThreshold;
        self.accordions.mem =
          self.accordions.mem || self.dataPeriod.mem.needUpgrade;
      }

      function updateMaxNETUpPercentageForPeriod(data) {
        const total =
          self.vm.flavor.inboundBandwidth *
          CLOUD_UNIT_CONVERSION.MEGABYTE_TO_BYTE;
        const maxUsed = maxBy(data.values, (v) =>
          angular.isNumber(v.value) ? v.value : Number.NEGATIVE_INFINITY,
        ).value;
        self.dataPeriod.net.up.max = (maxUsed / total) * 100;
        self.dataPeriod.net.up.needUpgrade =
          self.dataPeriod.net.up.max >=
          CLOUD_MONITORING.vm.upgradeAlertThreshold;
        self.accordions.net =
          self.accordions.net || self.dataPeriod.net.up.needUpgrade;
      }

      function updateMaxNETDownPercentageForPeriod(data) {
        const total =
          self.vm.flavor.outboundBandwidth *
          CLOUD_UNIT_CONVERSION.MEGABYTE_TO_BYTE;
        const maxUsed = maxBy(data.values, (v) =>
          angular.isNumber(v.value) ? v.value : Number.NEGATIVE_INFINITY,
        ).value;
        self.dataPeriod.net.down.max = (maxUsed / total) * 100;
        self.dataPeriod.net.down.needUpgrade =
          self.dataPeriod.net.down.max >=
          CLOUD_MONITORING.vm.upgradeAlertThreshold;
        self.accordions.net =
          self.accordions.net || self.dataPeriod.net.down.needUpgrade;
      }

      function updateChartsWithMonitoringData(data) {
        if (data['cpu:used']) {
          updateChart(
            'cpu:used',
            self.selectedChartPeriod['cpu:used'],
            data['cpu:used'],
          );
        }
        if (data['mem:used']) {
          updateChart(
            'mem:used',
            self.selectedChartPeriod['mem:used'],
            data['mem:used'],
          );
        }
        if (data['net:tx']) {
          updateChart(
            'net:tx',
            self.selectedChartPeriod['net:tx'],
            data['net:tx'],
          );
        }
        if (data['net:rx']) {
          updateChart(
            'net:rx',
            self.selectedChartPeriod['net:rx'],
            data['net:rx'],
          );
        }
      }

      function updateMaxPercentageForPeriod(data) {
        updateMaxCPUPercentageForPeriod(data['cpu:used']);
        updateMaxRAMPercentageForPeriod(data['mem:used']);
        updateMaxNETDownPercentageForPeriod(data['net:tx']);
        updateMaxNETUpPercentageForPeriod(data['net:rx']);
      }

      function updateMaxTypePercentageForPeriod(type, data) {
        if (type === 'cpu:used') {
          updateMaxCPUPercentageForPeriod(data);
        }
        if (type === 'mem:used') {
          updateMaxRAMPercentageForPeriod(data);
        }
        if (type === 'net:tx') {
          updateMaxNETDownPercentageForPeriod(data);
        }
        if (type === 'net:rx') {
          updateMaxNETUpPercentageForPeriod(data);
        }
      }

      // on period change, reload monitoring data and update chart
      self.onChartPeriodChanged = function onChartPeriodChanged(type) {
        const period = self.selectedChartPeriod[type];
        self.loaders.monitoring[type] = true;
        OvhApiCloudProjectInstance.v6().resetAllCache();
        OvhApiCloudProjectInstance.v6()
          .monitoring({
            serviceName: self.vm.serviceName,
            instanceId: self.vm.id,
            period,
            type,
          })
          .$promise.then(
            (data) => {
              updateChart(type, period, data);
              updateMaxTypePercentageForPeriod(type, data);
            },
            () => {
              self.chartData[type] = null;
            },
          )
          .finally(() => {
            self.loaders.monitoring[type] = false;
          });
      };

      function init() {
        self.vm = CloudProjectComputeInfrastructureOrchestrator.getMonitoredVm();
        $rootScope.$broadcast(
          'cuc-highlighted-element.show',
          `compute,${self.vm.id}`,
        );

        $(document).on('keyup', closeOnEscapeKey);
        $scope.$on('$destroy', () => {
          $(document).off('keyup', closeOnEscapeKey);
        });

        if (self.vm.monitoringData) {
          updateChartsWithMonitoringData(self.vm.monitoringData.raw);
          updateMaxPercentageForPeriod(self.vm.monitoringData.raw);
        } else {
          self.vm.getMonitoringData().finally(() => {
            if (self.vm.monitoringData) {
              updateChartsWithMonitoringData(self.vm.monitoringData.raw);
              updateMaxPercentageForPeriod(self.vm.monitoringData.raw);
            }
          });
        }

        $scope.$watch(
          'VmMonitoringCtrl.accordions.cpu',
          (oldValue) => {
            if (oldValue) {
              self.accordions.mem = false;
              self.accordions.net = false;
            }
          },
          true,
        );

        $scope.$watch(
          'VmMonitoringCtrl.accordions.mem',
          (oldValue) => {
            if (oldValue) {
              self.accordions.cpu = false;
              self.accordions.net = false;
            }
          },
          true,
        );

        $scope.$watch(
          'VmMonitoringCtrl.accordions.net',
          (oldValue) => {
            if (oldValue) {
              self.accordions.mem = false;
              self.accordions.cpu = false;
            }
          },
          true,
        );
      }

      $timeout(() => {
        init();
      });
    },
  );
