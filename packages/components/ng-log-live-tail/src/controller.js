import flatten from 'lodash/flatten';
import uniqBy from 'lodash/uniqBy.js';
import { format } from 'date-fns';
import * as dateFnsLocales from 'date-fns/locale';
import { PREFIX_KEYS, LEVEL_LABELS } from './constants';

export default class LogLiveTailCtrl {
  /* @ngInject */
  constructor(
    $translate,
    LogLiveTail,
    $interval,
    $timeout,
    $sce,
    $transclude,
    $locale,
  ) {
    this.$translate = $translate;
    this.LogLiveTail = LogLiveTail;
    this.$interval = $interval;
    this.$timeout = $timeout;
    this.$sce = $sce;
    this.$transclude = $transclude;
    this.$locale = $locale;
  }

  $onInit() {
    this.logs = [];
    this.interval = null;
    this.searchText = null;
    this.glued = true;
    this.url = null;
    this.errorMessage = null;
    this.isTileSlotFilled = this.$transclude.isSlotFilled('tile');
    this.fullScreen = !this.isTileSlotFilled;

    this.searchableKeys = [...PREFIX_KEYS, ...this.logKeys];
    this.setUrlTimeout = null;

    this.locale = this.constructor.getDateFnsLocale(this.$locale.localeID);
    this.dateFnsLocale = dateFnsLocales[this.locale];
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

      this.searchableKeys.forEach((key) => {
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
    return data.messages.map(({ message }) => {
      const { _id, timestamp, level } = message;

      // LOG PREFIX
      const formattedTimestamp = format(timestamp, 'P pp', {
        locale: this.dateFnsLocale,
      });

      const levelLabel = LEVEL_LABELS[level];

      // LOG CUSTOM FIELDS
      const customFields = this.logKeys.reduce((customLog, key) => {
        // eslint-disable-next-line no-param-reassign
        customLog[key] = this.getValueByPath(message, key) || '';
        return customLog;
      }, {});

      const formattedLog = {
        _id,
        formattedTimestamp,
        level,
        levelLabel,
        ...customFields,
      };

      return formattedLog;
    });
  }

  /**
   * angularJS version of packages/manager/core/utils/src/datefns/index.ts
   * Converts an ovh locale to date-fns locale.
   * Examples:
   *   getDateFnsLocale('fr_FR') => 'fr'
   *   getDateFnsLocale('fr_CA') => 'frCA'
   */
  static getDateFnsLocale(ovhLocale) {
    if (ovhLocale === 'en_GB') {
      return 'enGB';
    }
    if (ovhLocale === 'fr_CA') {
      return 'frCA';
    }
    const [locale] = ovhLocale?.split('_');
    return locale || 'enGB';
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
