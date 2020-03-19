import get from 'lodash/get';
import includes from 'lodash/includes';
import keys from 'lodash/keys';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';

import { COUNTRY_LIST } from './constants';

export default class {
  constructor() {
    this.data = {
      list: COUNTRY_LIST,
      supportedLanguage: ['iso', 'en_GB', 'en_US'],
      selectedLanguage: 'iso',
      asArray: undefined,
      asObject: undefined,
      asDataForSelect: undefined,
    };
  }

  setLanguage(language) {
    if (!language) {
      return;
    }

    if (!includes(this.data.supportedLanguage, language)) {
      return;
    }

    if (this.data.selectedLanguage !== language) {
      this.data.selectedLanguage = language;
      this.data.asArray = undefined;
      this.data.asObject = undefined;
      this.data.asDataForSelect = undefined;
    }
  }

  initArray() {
    if (this.data.asArray) {
      return;
    }
    this.data.asArray = map(this.data.list, (country) =>
      get(
        country,
        `lang.${this.data.selectedLanguage}`,
        get(country, 'lang.iso'),
      ),
    );
  }

  get value() {
    return this.data.list;
  }

  get length() {
    return keys(this.data.list).length;
  }

  get asArray() {
    if (!this.data.asArray) {
      this.initArray();
    }

    return this.data.asArray;
  }

  initObject() {
    if (this.data.asObject) {
      return;
    }
    this.data.asObject = mapValues(this.data.list, (country) =>
      get(
        country,
        `lang.${this.data.selectedLanguage}`,
        get(country, 'lang.iso'),
      ),
    );
  }

  get asObject() {
    if (!this.data.asObject) {
      this.initObject();
    }

    return this.data.asObject;
  }

  initDataForSelect() {
    if (this.data.asDataForSelect) {
      return;
    }
    this.data.asDataForSelect = map(this.data.list, (country, isoCode) => ({
      value: isoCode,
      label: get(
        country,
        `lang.${this.data.selectedLanguage}`,
        get(country, 'lang.iso'),
      ),
    }));
  }

  get asDataForSelect() {
    if (!this.data.asDataForSelect) {
      this.initDataForSelect();
    }

    return this.data.asDataForSelect;
  }
}
