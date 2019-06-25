import get from 'lodash/get';

import { COUNTRY_FLAG } from './constants';

export default class CountryFlagCtrl {
  getCountry() {
    const country = this.country && this.country.toLowerCase();
    return get(COUNTRY_FLAG, country, country);
  }
}
