import flatten from 'lodash/flatten';
import uniqBy from 'lodash/uniqBy.js';
import { DISPLAY_RULES } from './constants';

export default class LogToCustomerCtrl {
  /* @ngInject */
  constructor(
    $translate,
    LogToCustomer,
    $interval,
    $timeout,
    $sce,
    $transclude,
  ) {
    this.$translate = $translate;
    this.LogToCustomer = LogToCustomer;
    this.$interval = $interval;
    this.$timeout = $timeout;
    this.$sce = $sce;
    this.$transclude = $transclude;
  }

  $onInit() {
    this.logs = [];
    this.interval = null;
    this.searchText = null;
    this.glued = true;
    this.url = null;
    this.DISPLAY_RULES = DISPLAY_RULES;
    this.errorMessage = null;
    this.isRightTileSlotFilled = this.$transclude.isSlotFilled('tile');
    this.fullScreen = !this.isRightTileSlotFilled;

    this.keys = Object.keys(this.logKeys);
    this.setUrlTimeout = null;

    this.logKinds = [];
    this.LogToCustomer.getLogKinds(this.logKindApiUrl)
      .then((data) => {
        this.logKinds = data;
        this.selectedLogKind = data[0]?.name;
      })
      .then(() => this.generateTempUrlSource())
      .then(() => !this.errorMessage && this.startLog())
      .catch(this.setErrorMessage);
  }

  $onDestroy() {
    this.clearTimeout();
    if (this.interval) {
      this.clearInterval();
    }
  }

  clearTimeout() {
    if (this.setUrlTimeout) {
      this.$timeout.cancel(this.setUrlTimeout);
    }
  }

  switchLogKind(kind) {
    this.clearInterval();
    this.clearSession();
    this.selectedLogKind = kind;
    this.generateTempUrlSource().then(
      () => !this.errorMessage && this.startLog(),
    );
  }

  handleSearch() {
    this.logs = this.searchInLogs(this.logs);
  }

  searchInLogs(logs) {
    return logs.map((log) => {
      const highlightedLog = { ...log };

      this.keys.forEach((key) => {
        highlightedLog[`${key}_highlighted`] = this.safeHighlight(
          highlightedLog[key].toString(),
          this.searchText,
        );
      });

      return highlightedLog;
    });
  }

  safeHighlight(text, phrase) {
    if (!phrase) return this.$sce.trustAsHtml(text);
    const highlight = text.replace(
      new RegExp(`(${phrase})`, 'gi'),
      '<span class="highlight">$1</span>',
    );
    return this.$sce.trustAsHtml(highlight);
  }

  goToBottom() {
    this.glued = false;
    this.$timeout(() => {
      this.glued = true;
    });
  }

  toggleLogs() {
    if (this.interval) {
<<<<<<< HEAD
      this.clearInterval();
=======
      this.stop();
>>>>>>> bc22508a3d (feat(pci): log to customer - live tail (#10932))
    } else {
      this.startLog();
    }
  }

<<<<<<< HEAD
  clearInterval() {
=======
  stop() {
>>>>>>> bc22508a3d (feat(pci): log to customer - live tail (#10932))
    this.$interval.cancel(this.interval);
    this.interval = null;
  }

  clearSession() {
    this.logs.length = 0;
  }

  startLog() {
    this.interval = this.$interval(() => {
      this.LogToCustomer.getLogs(this.url)
        .then((data) => {
          this.appendLogs(data);
        })
        .catch(() => {
<<<<<<< HEAD
          this.clearInterval();
=======
          this.stop();
>>>>>>> bc22508a3d (feat(pci): log to customer - live tail (#10932))
          this.setErrorMessage();
        });
    }, 3000);
  }

  setErrorMessage() {
    this.errorMessage = `${this.$translate.instant('error_get_url')}`;
  }

  appendLogs(data) {
    if (!this.interval) {
      // In case user pressed pause with a pending API call, do not append the last received logs
      return;
    }

    const logs = this.searchInLogs(this.formatLogs(data));

    this.logs = uniqBy(
      flatten([...this.logs, logs]),
      (log) => log._id, // eslint-disable-line no-underscore-dangle
    );
  }

  static tryParseJSON(value) {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }

  getValueByPath(data, pathString) {
    const pathSegments = pathString.split('.');
    return pathSegments.reduce((currentValue, segment) => {
      if (currentValue === undefined) {
        return undefined;
      }
      return this.constructor.tryParseJSON(currentValue[segment]);
    }, data);
  }

  formatLogs(data) {
    return data.messages.map((log) => {
      return this.keys.reduce((customLog, key) => {
        const path = this.logKeys[key];
        // eslint-disable-next-line no-param-reassign
        customLog[key] = this.getValueByPath(log, path) || '';
        return customLog;
      }, {});
    });
  }

<<<<<<< HEAD
  generateTempUrlSource() {
    this.errorMessage = null;
    this.url = null;

    return this.LogToCustomer.getLogSourceUrl(
      this.logApiUrl,
      this.selectedLogKind,
    )
      .then((data) => {
        this.url = data.url;
        this.clearTimeout();

        const expirationConnectionTimeout =
          Date.parse(data.expirationDate) - new Date().getTime() - 300;
        this.setUrlTimeout = this.$timeout(() => {
          this.generateTempUrlSource();
=======
  setUrlSource() {
    return this.LogToCustomer.getLogSourceUrl(this.source)
      .then((data) => {
        this.url = data.url;
        const expirationConnectionTimeout =
          Date.parse(data.expirationDate) - new Date().getTime() - 300;

        this.setUrlTimeout = this.$timeout(() => {
          this.setUrlSource();
>>>>>>> bc22508a3d (feat(pci): log to customer - live tail (#10932))
        }, expirationConnectionTimeout);
      })
      .catch(() => {
        this.setErrorMessage();
      });
  }
}
