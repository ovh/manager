import clone from 'lodash/clone';
import get from 'lodash/get';
import head from 'lodash/head';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import union from 'lodash/union';
import words from 'lodash/words';

import { Environment, LANGUAGES } from '@ovh-ux/manager-config';

import { LANG_PATTERN } from './constants';

export default class {
  /* @ngInject */
  constructor($rootScope) {
    this.$rootScope = $rootScope;
  }

  $onInit() {
    this.availableLangs = this.getAvailableLangs();
    this.currentLanguage = this.getCurrentLang();

    if (!LANG_PATTERN.test(this.currentLanguage.key)) {
      throw new Error('Current selected language is not supported');
    }

    this.sublinks = this.getSublinks();
  }

  onClick() {
    this.$rootScope.$emit('ovh::notifications::hide');
    this.$rootScope.$emit('ovh::sidebar::hide');
  }

  getCurrentLang() {
    return this.availableLangs.find(
      ({ key }) => key === Environment.getUserLocale(),
    );
  }

  formatCurrentLang() {
    const [lang] = get(this.currentLanguage, 'key').split('_');
    return lang.toUpperCase();
  }

  getAvailableLangs() {
    let langs = clone(LANGUAGES.available);
    const AVAILABLE_LANGS = map(LANGUAGES.available, 'key');
    const excluded = get(this.langOptions, 'exclude', []);
    const included = get(this.langOptions, 'include', []);

    if (union(AVAILABLE_LANGS, excluded).length > AVAILABLE_LANGS.length) {
      throw new Error('Trying to exclude unsupported lang');
    }

    if (!isEmpty(excluded)) {
      langs = langs.filter(({ key }) => !excluded.includes(key));
    }

    if (union(AVAILABLE_LANGS, included).length > AVAILABLE_LANGS.length) {
      throw new Error('Trying to include unsupported lang');
    }

    if (!isEmpty(included)) {
      langs = langs.filter(({ key }) => included.includes(key));
    }

    return langs;
  }

  getSublinks() {
    return this.availableLangs.map((lang) => ({
      title: lang.name,
      isActive: lang.key === this.currentLanguage.key,
      lang: head(words(lang.key)),
      key: lang.key,
    }));
  }
}
