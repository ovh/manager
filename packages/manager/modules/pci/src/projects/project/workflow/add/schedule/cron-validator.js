import map from 'lodash/map';

export default class CronValidator {
  constructor() {
    this.monthAlias = {
      jan: '1',
      feb: '2',
      mar: '3',
      apr: '4',
      may: '5',
      jun: '6',
      jul: '7',
      aug: '8',
      sep: '9',
      oct: '10',
      nov: '11',
      dec: '12',
    };

    this.weekdaysAlias = {
      sun: '0',
      mon: '1',
      tue: '2',
      wed: '3',
      thu: '4',
      fri: '5',
      sat: '6',
    };

    this.wildcard = '*';
  }

  static split(cron) {
    return cron.trim().split(/\s+/);
  }

  static isInRange(value, start, stop) {
    return value >= start && value <= stop;
  }

  static isValidStep(value) {
    return value === undefined || value.search(/[^\d]/) === -1;
  }

  static convertAliasToNumber(aliasName, aliasMap) {
    const aliasNumber = aliasName.toLowerCase()
      .replace(
        /[a-z]{3}/g,
        (match) => (aliasMap[match] === undefined
          ? match : aliasMap[match]),
      );
    return aliasNumber;
  }

  isWildcard(value) {
    return value === this.wildcard;
  }

  validateRange(value, start, stop) {
    const sides = value.split('-');
    switch (sides.length) {
      case 1:
        return this.isWildcard(value)
            || this.constructor.isInRange(parseInt(value, 10), start, stop);
      case 2: {
        const sidesmap = map(sides, (side) => parseInt(side, 10));
        const small = sidesmap[0];
        const big = sidesmap[1];
        return small <= big
            && this.constructor.isInRange(small, start, stop)
            && this.constructor.isInRange(big, start, stop);
      }
      default:
        return false;
    }
  }

  validateRanges(value, start, stop) {
    if (value.search(/[^\d-,/*]/) !== -1) {
      return false;
    }
    const list = value.split(',');
    return list.every((condition) => {
      const splits = condition.split('/');
      if (splits.length > 2) {
        return false;
      }
      const left = splits[0]; const
        right = splits[1];
      return this.validateRange(left, start, stop)
        && this.constructor.isValidStep(right);
    });
  }

  validateSeconds(seconds) {
    return this.validateRanges(seconds, 0, 59);
  }

  validateMinutes(minutes) {
    return this.validateRanges(minutes, 0, 59);
  }

  validateHours(hours) {
    return this.validateRanges(hours, 0, 23);
  }

  validateDays(days) {
    return this.validateRanges(days, 1, 31);
  }

  validateMonths(months, alias) {
    // Prevents alias to be used as steps
    if (months.search(/\/[a-zA-Z]/) !== -1) {
      return false;
    }
    if (alias) {
      const remappedMonths = this.constructor.convertAliasToNumber(months, this.monthAlias);
      return this.validateRanges(remappedMonths, 1, 12);
    }
    return this.validateRanges(months, 1, 12);
  }

  validateWeekdays(weekdays, alias) {
    // Prevents alias to be used as steps
    if (weekdays.search(/\/[a-zA-Z]/) !== -1) {
      return false;
    }
    if (alias) {
      const remappedWeekdays = this.constructor.convertAliasToNumber(weekdays, this.weekdaysAlias);
      return this.validateRanges(remappedWeekdays, 0, 6);
    }
    return this.validateRanges(weekdays, 0, 6);
  }

  validateCron(cron, options = { alias: false, seconds: false }) {
    const splits = this.constructor.split(cron);
    if (splits.length > (options.seconds ? 6 : 5) || splits.length < 5) {
      return false;
    }
    const checks = [];
    if (splits.length === 6) {
      const seconds = splits.shift();
      if (seconds) {
        checks.push(this.validateSeconds(seconds));
      }
    }
    const minutes = splits[0];
    const hours = splits[1];
    const days = splits[2];
    const months = splits[3];
    const weekdays = splits[4];
    checks.push(this.validateMinutes(minutes));
    checks.push(this.validateHours(hours));
    checks.push(this.validateDays(days));
    checks.push(this.validateMonths(months, options.alias));
    checks.push(this.validateWeekdays(weekdays, options.alias));
    return checks.every(Boolean);
  }
}
