import NetworkSecurityService from '../network-security.service';
import {
  PAGE_SIZE,
  TRAFFIC_PERIODS,
  TRAFFIC_PERIOD_LIST,
  CHART,
} from './traffic.constant';

export default class TrafficController {
  /* @ngInject */
  constructor($stateParams, $translate, Alerter, networkSecurityService) {
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.networkSecurityService = networkSecurityService;

    this.TRAFFIC_PERIODS = TRAFFIC_PERIODS;
    this.TRAFFIC_PERIOD_LIST = TRAFFIC_PERIOD_LIST;
    this.CHART = CHART;
    this.PAGE_SIZE = PAGE_SIZE;
  }

  $onInit() {
    this.errorMessage = '';
    this.pageSize = 10;
    this.isStackable = true;
    this.isPPs = false;
    this.isServiceSelected = false;
    this.subnet = '';
    this.periods = this.networkSecurityService.initPeriods(
      this.TRAFFIC_PERIODS,
    );
    this.period = this.periods[this.periods.length - 1];
    this.networkSecurityService.initService().then((data) => {
      this.services = data;
      return data;
    });
    this.ip = this.$stateParams.ip;
    this.dateTime = this.$stateParams.dateTime
      ? new Date(this.$stateParams.dateTime)
      : null;
    if (this.dateTime) {
      const dateLimit = new Date();
      dateLimit.setDate(dateLimit.getDate() - 14);
      if (this.dateTime >= dateLimit) {
        const customPeriod = {
          name: 'custom',
          label: this.$translate.instant(
            'network_security_dashboard_filter_custom',
          ),
        };
        this.periods.push(customPeriod);
        this.period = this.periods[this.periods.length - 1];
      } else {
        // Display warning message
        this.displayWarning = true;
      }
    }
    if (this.ip) {
      this.selectedIp = this.ip;
      this.checkSelectedSubnet(this.ip);
    }

    this.units = this.CHART.units;
    this.colors = this.CHART.colors;
    this.options = {
      ...this.CHART.options,
    };
    this.isSubnetValid = true;

    // Retrieve time zone offset to initialize value of UTC
    const timeZoneOffset = (new Date().getTimezoneOffset() / 60) * -1;
    this.timeZoneLabel = this.$translate.instant(
      'network_security_dashboard_time_zone',
      {
        timeZoneOffset:
          timeZoneOffset > 0 ? `+${timeZoneOffset}` : timeZoneOffset,
      },
    );
  }

  selectService() {
    this.isSubnetValid = true;
    if (this.service) {
      this.pageSize = 10;
      this.page = 1;
      this.autocomplete = [];
      this.selectedIp = '';
      this.ipsList = null;
      this.subnetSelected = null;
      this.isServiceSelected = true;
      this.results = null;
      this.networkSecurityService
        .getIpsFromService(
          this.page,
          this.pageSize,
          this.service.serviceName,
          this.autocomplete,
        )
        .then((data) => {
          this.ipsList = data.map(({ ipBlock }) => ipBlock);
        });
    } else {
      this.isServiceSelected = false;
      this.results = null;
    }
  }

  checkSelectedSubnet(value) {
    let isSubnetValid = true;

    if (!value || (value.indexOf('/') === -1 && !ipaddr.isValid(value))) {
      isSubnetValid = false;
    } else if (value.indexOf('/') > -1) {
      const ip = value.split('/');
      if (!ipaddr.isValid(ip[0]) || Number.isNaN(ip[1])) {
        isSubnetValid = false;
      }
    }

    this.isSubnetValid = isSubnetValid;
    if (isSubnetValid) {
      this.subnet = NetworkSecurityService.getMaskValue(value);
      this.model = this.subnet;
      this.getTraffic();
    }
  }

  onSelectSubnet() {
    this.subnet = this.subnetSelected;
    this.getTraffic();
  }

  onReset() {
    this.results = null;
    this.isSubnetValid = true;
  }

  getTraffic() {
    if (!this.subnet) {
      return;
    }
    this.isLoading = true;
    this.results = null;
    this.displayGraph = false;
    const currentDate = new Date();
    const after = new Date();
    const before = currentDate.toISOString();
    switch (this.period.name) {
      case this.TRAFFIC_PERIOD_LIST.last6h:
        after.setTime(after.getTime() - 6 * 60 * 60 * 1000);
        break;
      case this.TRAFFIC_PERIOD_LIST.last7d:
        after.setDate(after.getDate() - 7);
        break;
      case this.TRAFFIC_PERIOD_LIST.last14d:
        after.setDate(after.getDate() - 14);
        break;
      case 'custom':
        after.setTime(this.dateTime);
        break;
      default:
        after.setDate(after.getDate() - 1);
    }
    this.getAllTraffic(null, after.toISOString(), before, this.subnet);
  }

  getAllTraffic(cursor, after, before, subnet) {
    const params = {
      after,
      before,
      subnet,
    };
    this.networkSecurityService
      .getAllTraffic({
        cursor,
        params,
        pageSize: this.PAGE_SIZE,
      })
      .then((response) => {
        const { data } = response;
        if (data.message) {
          this.Alerter.error(
            this.$translate.instant('network_security_dashboard_events_error'),
            'network_security_error',
          );
          return data;
        }
        if (data) {
          if (!this.results) {
            this.results = data;
          } else {
            this.results.timestamps = this.results.timestamps.concat(
              data.timestamps,
            );
            this.results.bps.dropped = this.results.bps.dropped.concat(
              data.bps.dropped,
            );
            this.results.bps.passed = this.results.bps.passed.concat(
              data.bps.passed,
            );
            this.results.pps.dropped = this.results.pps.dropped.concat(
              data.pps.dropped,
            );
            this.results.pps.passed = this.results.pps.passed.concat(
              data.pps.passed,
            );
          }
        }
        if (response.cursor.next) {
          this.getAllTraffic(response.cursor.next, after, before, subnet);
        } else {
          this.isLoading = false;
          this.displayGraph = true;
          this.resume(after, before, subnet);
          this.loadGraph();
        }
        return this.results;
      })
      .catch(() => {
        this.isLoading = false;
        this.Alerter.error(
          this.$translate.instant('network_security_dashboard_events_error'),
          'network_security_error',
        );
      });
  }

  getAllEvents(cursor, after, before, subnet) {
    const params = {
      after,
      before,
      subnets: subnet,
    };

    this.networkSecurityService
      .getEventsList({
        cursor,
        params,
        pageSize: this.PAGE_SIZE,
      })
      .then((response) => {
        const events = response.data;
        this.numberOfEvents += events.length;
        events.forEach((ev) => {
          this.attacksDetected += ev.vectors.length;
        });
        if (response.cursor.next) {
          this.getAllEvents(response.cursor.next, after, before, subnet);
        }
      });
  }

  resume(after, before, subnet) {
    // Set number of events
    this.numberOfEvents = 0;
    // Set attacks detected
    this.attacksDetected = 0;

    // Get all events to count number of events and detected attacks
    this.getAllEvents(null, after, before, subnet);

    // Set packets dropped
    let packetsDropped = 0;
    this.results.pps.dropped.forEach((packet) => {
      packetsDropped += parseInt(packet, 10);
    });
    let unit = TrafficController.getUnitIndex(packetsDropped);
    let label = '';
    if (unit > 0) {
      label = this.units[unit].split('b');
    }
    if (packetsDropped > 0) {
      this.packetsDropped = `${TrafficController.formatBits(
        packetsDropped,
        unit,
      )} ${label[0] ? label[0] : ''}`;
    } else {
      this.packetsDropped = null;
    }

    // Set bandwith cleaned
    let bandwithCleaned = 0;
    this.results.bps.dropped.forEach((packet) => {
      bandwithCleaned += parseInt(packet, 10);
    });
    unit = TrafficController.getUnitIndex(bandwithCleaned);
    if (bandwithCleaned > 0) {
      this.bandwithCleaned = `${TrafficController.formatBits(
        bandwithCleaned,
        unit,
      )} ${this.units[unit]}`;
    } else {
      this.bandwithCleaned = null;
    }
  }

  updateStackable(value) {
    this.isStackable = value;
    this.loadGraph();
  }

  loadGraph(isPPs) {
    if (isPPs !== undefined) {
      this.isPPs = isPPs;
    }
    this.series = [];
    this.data = [];

    if (this.isStackable) {
      this.options.scales.yAxes[0].stacked = true;
    } else {
      delete this.options.scales.yAxes[0].stacked;
    }

    this.labels = this.results?.timestamps?.map((value) => value);

    this.series.push(
      this.$translate.instant('network_security_dashboard_legend_green'),
    );
    this.series.push(
      this.$translate.instant('network_security_dashboard_legend_red'),
    );
    if (!this.isPPs) {
      // Get unit from max value from table
      let maxPassedValue = 0;
      let maxDroppedValue = 0;
      let unitIndex = 0;
      this.results.bps.passed.forEach((val) => {
        if (parseInt(val, 10) > maxPassedValue) {
          maxPassedValue = parseInt(val, 10);
        }
      });
      this.results.bps.passed.forEach((val) => {
        if (parseInt(val, 10) > maxDroppedValue) {
          maxDroppedValue = parseInt(val, 10);
        }
      });
      if (maxPassedValue > maxDroppedValue) {
        unitIndex = TrafficController.getUnitIndex(maxPassedValue);
      } else {
        unitIndex = TrafficController.getUnitIndex(maxDroppedValue);
      }

      // Display unit label
      this.options.scales.yAxes[0].scaleLabel.labelString = this.$translate.instant(
        `network_security_dashboard_unit_${this.units[
          unitIndex
        ].toLowerCase()}_ps`,
      );

      this.data.push(
        this.results?.bps.passed?.map((value) =>
          TrafficController.formatBits(parseInt(value, 10), unitIndex),
        ),
      );
      this.data.push(
        this.results?.bps.dropped?.map((value) =>
          TrafficController.formatBits(parseInt(value, 10), unitIndex),
        ),
      );
    } else {
      this.options.scales.yAxes[0].scaleLabel.labelString = this.$translate.instant(
        'network_security_dashboard_pps',
      );

      this.data.push(this.results?.pps.passed?.map((value) => value));
      this.data.push(this.results?.pps.dropped?.map((value) => value));
    }
  }

  static getUnitIndex(value) {
    if (value === 0) {
      return 0;
    }
    return Math.floor(Math.log(value) / Math.log(1000));
  }

  static formatBits(value, i) {
    if (value === 0) {
      return 0;
    }
    const result = parseFloat((value / 1000 ** i).toFixed(2));
    return result;
  }
}
