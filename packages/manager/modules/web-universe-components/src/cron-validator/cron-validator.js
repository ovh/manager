import angular from 'angular';
import keys from 'lodash/keys';
import pickBy from 'lodash/pickBy';
import range from 'lodash/range';
import uniq from 'lodash/uniq';

export default function cronValidator() {
  const self = this;

  let cronMinutes = '?';
  const months =
    '(?:JAN)|(?:FEB)|(?:MAR)|(?:APR)|(?:MAY)|(?:JUN)|(?:JUL)|(?:AUG)|(?:SEP)|(?:OCT)|(?:NOV)|(?:DEC)';
  const days = '(?:MON)|(?:TUE)|(?:WED)|(?:THU)|(?:FRI)|(?:SAT)|(?:SUN)';

  const validacron = {
    m: /^(?:(?:\*|[0-5]?\d(?!\/)|[0-5]?\d-[0-5]?\d)(?:\/[0-5]?\d|)(?:,(?!$)|$))+$/,
    h: /^(?:(?:\*|(?:[0-1]?\d|2[0-3])(?!\/)|(?:[0-1]?\d|2[0-3])-(?:[0-1]?\d|2[0-3]))(?:\/(?:[0-1]?\d|2[0-3])|)(?:,(?!$)|$))+$/,
    dom: /^(?:(?:\*|(?:[0-2]?\d|3[01])(?!\/)|(?:[0-2]?\d|3[01])-(?:[0-2]?\d|3[01]))(?:\/(?:[0-2]?\d|3[01])|)(?:,(?!$)|$))+$/,
    mon: new RegExp(
      `^(?:(?:\\*|(?:0?\\d|1[0-2]|(?:${months}))(?!\\/)|(?:0?\\d|1[0-2]|(?:${months}))-(?:0?\\d|1[0-2]|(?:${months})))(?:\\/(?:0?\\d|1[0-2])|)(?:,(?!$)|$))+$`,
      'i',
    ),
    dow: new RegExp(
      `^(?:(?:\\*|(?:[0-7]|${days})(?!\\/)|(?:[0-7]|${days})-(?:[0-7]|${days}))(?:\\/(?:[0-7])|)(?:,(?!$)|$))+$`,
      'i',
    ),
  };

  const cronFieldRegex = {
    items: {
      h: /^(?:(?:(?:[0-1]?\d|2[0-3])|(?:[0-1]?\d|2[0-3])-(?:[0-1]?\d|2[0-3]))(?:,(?!$)|$))+$/,
      dom: /^(?:(?:(?:[0-2]?\d|3[01])|(?:[0-2]?\d|3[01])-(?:[0-2]?\d|3[01]))(?:,(?!$)|$))+$/,
      mon: new RegExp(
        `^(?:(?:(?:0?\\d|1[0-2]|(?:${months}))|(?:0?\\d|1[0-2]|(?:${months}))-(?:0?\\d|1[0-2]|(?:${months})))(?:,(?!$)|$))+$`,
        'i',
      ),
      dow: new RegExp(
        `^(?:(?:(?:[0-7]|${days})|(?:[0-7]|${days})-(?:[0-7]|${days}))(?:,(?!$)|$))+$`,
        'i',
      ),
    },
    interval: {
      h: /^\*\/(0*(?:[2-9]|1\d|2[0-3]))$/,
      dom: /^\*\/(0*(?:[2-9]|[12]\d|3[0-1]))$/,
      mon: /^\*\/(0*(?:[2-9]|1[0-2]))$/,
      dow: /^\*\/(0*[2-7])$/,
    },
    range: {
      h: /^([0-1]?\d|2[0-3])-([0-1]?\d|2[0-3])$/,
      dom: /^([0-2]?\d|3[01])-([0-2]?\d|3[01])$/,
      mon: new RegExp(
        `^(0?\\d|1[0-2]|(?:${months}))-(0?\\d|1[0-2]|(?:${months}))$`,
        'i',
      ),
      dow: new RegExp(`^([0-7]|${days})-([0-7]|${days})$`, 'i'),
    },
  };

  /**
   * Intialiates a CrontabObject that holds the state of a cron edition screen.
   * @returns {CrontabObject}
   */
  this.makeCrontabObject = () => new self.CrontabObject(self);

  /**
   * @constructor
   */
  this.CrontabObject = function crontabObject(WucCronValidator) {
    const cron = new WucCronValidator.CronValue();
    const mode = new WucCronValidator.CronMode();

    this.isValid = () => WucCronValidator.isCronValid(cron, mode);

    this.setCrontab = (crontab) => {
      WucCronValidator.initializeFromCrontab(crontab, cron, mode);
    };

    this.getCrontab = () => WucCronValidator.toCrontab(cron, mode);

    this.getCronValue = () => cron;

    this.getCronMode = () => mode;
  };

  /**
   * @constructor
   */
  this.CronMode = () => ({
    active: 'simple',
    simple: {
      h: 'all',
      dom: 'all',
      mon: 'all',
      dow: 'all',
    },
    expert: null,
  });

  /**
   * @constructor
   */
  this.CronValue = () => ({
    simple: {
      items: {
        h: {},
        dom: {},
        mon: {},
        dow: {},
      },
      interval: {
        h: null,
        dom: null,
        mon: null,
        dow: null,
      },
      range: {
        h: { from: null, to: null },
        dom: { from: null, to: null },
        mon: { from: null, to: null },
        dow: { from: null, to: null },
      },
    },
    expert: {
      h: '*',
      dom: '*',
      mon: '*',
      dow: '*',
    },
  });

  this.getSimpleModeItems = (cronValue, field) => {
    let selectValuesTempo = pickBy(
      cronValue.simple.items[field],
      (selectValue) => !!selectValue,
    );
    selectValuesTempo = keys(selectValuesTempo);
    return selectValuesTempo.sort((a, b) => a - b);
  };

  // Simple mode -> crontab
  function simpleToCrontab(cronValue, cronMode) {
    const cron = {
      h: '',
      dom: '',
      mon: '',
      dow: '',
    };

    angular.forEach(cron, (val, key) => {
      switch (cronMode.simple[key]) {
        case 'all':
          cron[key] = '*';
          break;
        case 'items':
          cron[key] = self.getSimpleModeItems(cronValue, key).toString();
          break;
        case 'interval':
          cron[key] = `*/${cronValue.simple.interval[key]}`;
          break;
        case 'range':
          cron[
            key
          ] = `${cronValue.simple.range[key].from}-${cronValue.simple.range[key].to}`;
          break;
        default:
          break;
      }
    });

    return [cronMinutes, cron.h, cron.dom, cron.mon, cron.dow].join(' ');
  }

  // Expert mode -> crontab
  function expertToCrontab(cronValue) {
    return [
      cronMinutes,
      cronValue.expert.h,
      cronValue.expert.dom,
      cronValue.expert.mon,
      cronValue.expert.dow,
    ].join(' ');
  }

  function clearWords(type, _val) {
    let val = _val;

    if (type === 'mon') {
      val = val.replace(/(JAN)/gi, 1);
      val = val.replace(/(FEB)/gi, 2);
      val = val.replace(/(MAR)/gi, 3);
      val = val.replace(/(APR)/gi, 4);
      val = val.replace(/(MAY)/gi, 5);
      val = val.replace(/(JUN)/gi, 6);
      val = val.replace(/(JUL)/gi, 7);
      val = val.replace(/(AUG)/gi, 8);
      val = val.replace(/(SEP)/gi, 9);
      val = val.replace(/(OCT)/gi, 10);
      val = val.replace(/(NOV)/gi, 11);
      val = val.replace(/(DEC)/gi, 12);
    } else if (type === 'dow') {
      val = val.replace(/(MON)/gi, 1);
      val = val.replace(/(TUE)/gi, 2);
      val = val.replace(/(WED)/gi, 3);
      val = val.replace(/(THU)/gi, 4);
      val = val.replace(/(FRI)/gi, 5);
      val = val.replace(/(SAT)/gi, 6);
      val = val.replace(/(SUN)/gi, 0);
    }

    return val;
  }

  /* eslint-disable no-param-reassign */
  // Crontab -> Simple mode
  function crontabToSimple(crontab, cronValue, cronMode) {
    let splittedCrontab = crontab.split(' ');

    if (splittedCrontab.length !== 5) {
      return;
    }

    [cronMinutes] = splittedCrontab;

    splittedCrontab = {
      h: splittedCrontab[1],
      dom: splittedCrontab[2],
      mon: splittedCrontab[3],
      dow: splittedCrontab[4],
    };

    angular.forEach(splittedCrontab, (_val, key) => {
      let val = _val;

      if (val === '*') {
        // '*' only = all
        cronMode.simple[key] = 'all';
      } else if (cronFieldRegex.interval[key].test(val)) {
        // '*/N' only = interval
        cronMode.simple[key] = 'interval';
        cronValue.simple.interval[key] = parseInt(
          val.match(cronFieldRegex.interval[key])[1],
          10,
        );
      } else if (cronFieldRegex.range[key].test(val)) {
        // 'N-N' only = range
        val = clearWords(key, val);
        cronMode.simple[key] = 'range';
        cronValue.simple.range[key].from = parseInt(
          val.match(cronFieldRegex.range[key])[1],
          10,
        );
        cronValue.simple.range[key].to = parseInt(
          val.match(cronFieldRegex.range[key])[2],
          10,
        );
      } else if (cronFieldRegex.items[key].test(val)) {
        // ***ELSE*** 'N' or 'N,N' or 'N,N-N' etc... = items
        val = clearWords(key, val);

        const splittedItems = val.split(',');
        let clearedItems = [];
        let from;
        let to;
        angular.forEach(splittedItems, (_splittedItem) => {
          let splittedItem = _splittedItem;

          if (key === 'dow') {
            splittedItem = splittedItem.replace(/7/g, 0);
          }
          if (cronFieldRegex.range[key].test(splittedItem)) {
            // Transform range to fixed values
            from = parseInt(
              splittedItem.match(cronFieldRegex.range[key])[1],
              10,
            );
            to = parseInt(splittedItem.match(cronFieldRegex.range[key])[2], 10);
            if (from === to) {
              clearedItems.push(from);
            } else if (from < to) {
              clearedItems = clearedItems.concat(range(from, to + 1));
            } else if (to === 0) {
              to = 7;
              clearedItems = clearedItems.concat(range(from, to + 1));
              if (clearedItems.indexOf(7) !== -1) {
                // @TODO this is crapy, improve it later
                clearedItems[clearedItems.indexOf(7)] = 0;
              }
            }
          } else {
            clearedItems.push(splittedItem);
          }
        });
        clearedItems = uniq(clearedItems);
        cronValue.simple.items[key] = {}; // todo

        angular.forEach(clearedItems, (splittedVal) => {
          const splittedValStr = splittedVal.toString();
          cronValue.simple.items[key][splittedValStr] = true;
        });

        cronMode.simple[key] = 'items';
      }
    });

    cronMode.active = 'simple';
  }

  // Crontab -> Expert mode
  function crontabToExpert(crontab, cronValue, cronMode) {
    const splittedCrontab = crontab.split(' ');
    if (splittedCrontab.length !== 5) {
      return;
    }

    [cronMinutes] = splittedCrontab;

    cronValue.expert = {
      h: splittedCrontab[1],
      dom: splittedCrontab[2],
      mon: splittedCrontab[3],
      dow: splittedCrontab[4],
    };

    cronMode.active = 'expert';
  }
  /* eslint-enable no-param-reassign */

  // Simple or expert -> crontab
  this.toCrontab = (cronValue, cronMode) => {
    if (cronMode.active === 'simple') {
      return simpleToCrontab(cronValue, cronMode);
    }

    return expertToCrontab(cronValue);
  };

  // Check if crontab is OK for simple mode
  function checkIfCrontabIsOkForSimpleMode(crontab) {
    let splittedCrontab = crontab.split(' ');
    let isOK = true;

    if (splittedCrontab.length !== 5) {
      return false;
    }

    splittedCrontab = {
      h: splittedCrontab[1],
      dom: splittedCrontab[2],
      mon: splittedCrontab[3],
      dow: splittedCrontab[4],
    };

    angular.forEach(splittedCrontab, (val, key) => {
      if (
        val !== '*' &&
        !cronFieldRegex.interval[key].test(val) &&
        !cronFieldRegex.range[key].test(val) &&
        !cronFieldRegex.items[key].test(val)
      ) {
        isOK = false;
      }
    });

    return isOK;
  }

  this.initializeFromCrontab = (crontab, cronValue, cronMode) => {
    if (checkIfCrontabIsOkForSimpleMode(crontab)) {
      crontabToSimple(crontab, cronValue, cronMode);
    } else {
      crontabToExpert(crontab, cronValue, cronMode);
    }
  };

  this.switchToSimpleMode = (cronValue, cronMode) => {
    let isSuccessful = true;
    if (cronMode.active === 'simple') {
      return isSuccessful;
    }
    const crontab = expertToCrontab(cronValue);
    if (checkIfCrontabIsOkForSimpleMode(crontab)) {
      crontabToSimple(crontab, cronValue, cronMode);
    } else {
      isSuccessful = false;
    }
    return isSuccessful;
  };

  this.switchToExpertMode = (cronValue, cronMode) => {
    if (cronMode.active === 'expert') {
      return;
    }
    crontabToExpert(simpleToCrontab(cronValue, cronMode), cronValue, cronMode);
  };

  this.isCronValid = (cronValue, cronMode) => {
    if (cronMode.active === 'simple') {
      // Mode simple
      return (
        self.cronSimpleValueIsValid('h', cronValue, cronMode) &&
        self.cronSimpleValueIsValid('dom', cronValue, cronMode) &&
        self.cronSimpleValueIsValid('mon', cronValue, cronMode) &&
        self.cronSimpleValueIsValid('dow', cronValue, cronMode)
      );
    }

    // Mode expert
    return (
      self.cronExpertValueIsValid('h', cronValue) &&
      self.cronExpertValueIsValid('dom', cronValue) &&
      self.cronExpertValueIsValid('mon', cronValue) &&
      self.cronExpertValueIsValid('dow', cronValue)
    );
  };

  this.cronSimpleValueIsValid = (field, cronValue, cronMode) => {
    switch (cronMode.simple[field]) {
      case 'all':
        return true;
      case 'items':
        return !!self.getSimpleModeItems(cronValue, field).length;
      case 'interval':
        return !!cronValue.simple.interval[field];
      case 'range':
        return !!(
          cronValue.simple.range[field].from != null &&
          cronValue.simple.range[field].to != null &&
          cronValue.simple.range[field].to > cronValue.simple.range[field].from
        );
      default:
        return false;
    }
  };

  this.cronExpertValueIsValid = (field, cronValue) =>
    cronValue.expert[field] && validacron[field].test(cronValue.expert[field]);
}
