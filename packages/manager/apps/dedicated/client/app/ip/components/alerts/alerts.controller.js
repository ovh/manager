export default class IpComponentsAlertsController {
  /* @ngInject */
  constructor($http, $q, Ip) {
    this.$http = $http;
    this.$q = $q;
    this.Ip = Ip;
    this.reset();
  }

  get messageType() {
    if (this.error) {
      return 'error';
    }
    if (this.alerts && !this.countAlerts()) {
      return 'success';
    }
    return 'warning';
  }

  get serviceTypeSuffix() {
    return this.serviceType ? '_with_service' : '';
  }

  get isResetable() {
    return this.loading || Boolean(this.alerts);
  }

  $onChanges(changes) {
    if (changes.serviceType) {
      this.reset();
    }
  }

  $onDestroy() {
    this.reset();
  }

  reset() {
    if (this.cancelLoad) {
      this.cancelLoad();
    }
    this.alerts = null;
    this.alertTypes = null;
    this.cancelLoad = null;
    this.error = null;
    this.loading = false;
  }

  toggleAlerts() {
    if (this.isResetable) {
      this.reset();
    } else {
      this.loadAlerts();
    }
  }

  loadAlerts() {
    this.loading = true;
    const { request, cancel } = this.Ip.fetchAlerts({
      serviceType: this.serviceType,
    });
    this.cancelLoad = cancel;
    return request
      .then((alerts) => {
        this.alerts = alerts;
        this.alertTypes = Object.keys(alerts);
      })
      .catch((error) => {
        this.error = error.data?.message || error.message;
      })
      .finally(() => {
        this.cancelLoad = null;
        this.loading = false;
      });
  }

  countAlerts(type) {
    if (!this.alerts) {
      return 0;
    }
    if (!type) {
      return Object.values(this.alerts).reduce(
        (count, list) => count + list.length,
        0,
      );
    }
    return this.alerts[type].length;
  }
}
