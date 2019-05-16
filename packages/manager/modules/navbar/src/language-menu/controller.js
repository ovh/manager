import clone from 'lodash/clone';
import get from 'lodash/get';
import head from 'lodash/head';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import union from 'lodash/union';
import words from 'lodash/words';

import { Environment } from '@ovh-ux/manager-config';
import { LANGUAGES, LANG_PATTERN } from './constants';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $translate,
    atInternet,
    NavbarNotifications,
    ovhManagerNavbarMenuHeaderBuilder,
    TranslateService,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.NavbarBuilder = ovhManagerNavbarMenuHeaderBuilder;
    this.NavbarNotifications = NavbarNotifications;
    this.TranslateService = TranslateService;

    this.REGION = Environment.getRegion();
  }

  $onInit() {
    this.availableLangs = this.getAvailableLangs();
    this.currentLanguage = this.getCurrentLang();

    if (!LANG_PATTERN.test(this.currentLanguage.value)) {
      throw new Error('Current selected language is not supported');
    }

    this.sublinks = this.getSublinks();
  }

  getCurrentLang() {
    return this.availableLangs
      .find(({ value }) => value === this.TranslateService.getUserLocale());
  }

  formatCurrentLang() {
    const [lang] = get(this.currentLanguage, 'value').split('_');
    return lang.toUpperCase();
  }

  getAvailableLangs() {
    let langs = clone(LANGUAGES);
    const AVAILABLE_LANGS = map(LANGUAGES, 'value');
    const excluded = get(this.langOptions, 'exclude', []);
    const included = get(this.langOptions, 'include', []);

    if (union(AVAILABLE_LANGS, excluded).length > AVAILABLE_LANGS.length) {
      throw new Error('Trying to exclude unsupported lang');
    }

    if (!isEmpty(excluded)) {
      langs = langs.filter(({ value }) => !excluded.includes(value));
    }

    if (union(AVAILABLE_LANGS, included).length > AVAILABLE_LANGS.length) {
      throw new Error('Trying to include unsupported lang');
    }

    if (!isEmpty(included)) {
      langs = langs.filter(({ value }) => included.includes(value));
    }

    return langs;
  }

  changeLang(lang) {
    this.currentLanguage = lang;
    return this.$scope.$emit('lang.onChange', { lang: lang.lang });
  }

  getSublinks() {
    return this.availableLangs.map(lang => ({
      title: lang.name,
      isActive: lang.value === this.currentLanguage.value,
      lang: head(words(lang.value)),
    }));
  }
}
