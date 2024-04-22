import flatten from 'lodash/flatten';
import uniqBy from 'lodash/uniqBy.js';
import { DISPLAY_RULES } from './constants';

export default class LogLiveTailCtrl {
  /* @ngInject */
  constructor($translate, LogLiveTail, $interval, $timeout, $sce, $transclude) {
    this.$translate = $translate;
    this.LogLiveTail = LogLiveTail;
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
    this.isTileSlotFilled = this.$transclude.isSlotFilled('tile');
    this.fullScreen = !this.isTileSlotFilled;

    this.keys = Object.keys(this.logKeys);
    this.setUrlTimeout = null;
  }

  $onChanges(changes) {
    if (changes.logKind) {
      this.$timeout(() => {
        this.clearInterval();
        this.clearSession();
        this.generateTempUrlSource()
          .then(() => !this.errorMessage && this.startLog())
          .catch(this.setErrorMessage);
      });
    }
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
      this.clearInterval();
    } else {
      this.startLog();
    }
  }

  clearInterval() {
    this.$interval.cancel(this.interval);
    this.interval = null;
  }

  clearSession() {
    this.logs.length = 0;
  }

  startLog() {
    this.interval = this.$interval(() => {
      this.LogLiveTail.getLogs(this.url)
        .then((data) => {
          this.appendLogs(data);
        })
        .catch(() => {
          this.clearInterval();
          this.setErrorMessage();
        });
    }, 2000);
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

  generateTempUrlSource() {
    this.errorMessage = null;
    this.url = null;

    return this.LogLiveTail.getLogSourceUrl(this.logApiUrl, this.logKind)
      .then((data) => {
        this.url = data.url;
        this.clearTimeout();

        const expirationConnectionTimeout =
          Date.parse(data.expirationDate) - new Date().getTime() - 300;
        this.setUrlTimeout = this.$timeout(() => {
          this.generateTempUrlSource();
        }, expirationConnectionTimeout);
      })
      .catch(() => {
        this.setErrorMessage();
      });
  }
}
