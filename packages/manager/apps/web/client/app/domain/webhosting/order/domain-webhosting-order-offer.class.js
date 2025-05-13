import capitalize from 'lodash/capitalize';
import flattenDeep from 'lodash/flattenDeep';
import trim from 'lodash/trim';

import {
  DATABASE_ISOLATION_TYPES,
  DISK_SIZE_MULTIPLE,
  DISK_SIZE_UNIT,
} from './domain-webhosting-order.constants';

function getSpecificDatabases(databases, type) {
  return databases.filter(({ isolation }) => isolation === type);
}

export default class WebHostingOffer {
  constructor(properties) {
    Object.assign(this, properties);

    const sharedDatabases = this.databases
      ? getSpecificDatabases(this.databases, DATABASE_ISOLATION_TYPES.SHARED)
      : [];

    this.sharedDatabases = sharedDatabases.map((database) => ({
      available: database.available,
      ...this.constructor.formatSizeValue(database.quota),
      type: database.type,
    }));
  }

  get localDatabases() {
    const localDatabases = getSpecificDatabases(
      this.databases,
      DATABASE_ISOLATION_TYPES.LOCAL,
    );

    return flattenDeep(localDatabases.map(({ engines }) => engines));
  }

  get formattedDiskSpace() {
    return {
      ...this.constructor.formatSizeValue(this.disk),
      type: this.disk.type,
    };
  }

  get formattedEmailAccount() {
    return {
      unit: this.emails.quota.unit,
      value: `${this.emails.available} x ${this.emails.quota.value}`,
    };
  }

  get formattedHighlight() {
    return this.highlight ? capitalize(trim(this.highlight)) : this.highlight;
  }

  get formattedLanguages() {
    const languagesKeys = Object.keys(this.languages);
    const availableLanguages = languagesKeys.filter(
      (language) => this.languages[language].length > 0,
    );

    return availableLanguages;
  }

  static formatSizeValue({ unit: sizeUnit, value: sizeValue }) {
    let value = sizeValue;
    let unit = sizeUnit;
    if (sizeValue >= DISK_SIZE_MULTIPLE.THOUSAND) {
      value = sizeValue / DISK_SIZE_MULTIPLE.THOUSAND;
      unit = DISK_SIZE_UNIT.GB;
    }

    if (sizeValue >= DISK_SIZE_MULTIPLE.MILLION) {
      value = sizeValue / DISK_SIZE_MULTIPLE.MILLION;
      unit = DISK_SIZE_UNIT.TB;
    }

    return { unit, value };
  }
}
