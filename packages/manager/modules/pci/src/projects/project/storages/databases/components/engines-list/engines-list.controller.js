import capitalize from 'lodash/capitalize';

import { ENGINE_LOGOS } from './engines-list.constants';

export default class {
  constructor() {
    this.capitalize = capitalize;
    this.ENGINE_LOGOS = ENGINE_LOGOS;
  }
}
