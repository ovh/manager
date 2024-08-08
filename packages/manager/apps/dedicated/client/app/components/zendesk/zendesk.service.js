class zendeskService {
  /* @ngInject */
  constructor($translate, User) {
    this.$translate = $translate;
    this.User = User;
  }

  getLanguageCodeFromTranslator() {
    const DEFAULT_LANGUAGE_CODE = 'en-US';
    let selectedLanguageCode = DEFAULT_LANGUAGE_CODE;
    const languageCorrespondance = {
      de_DE: 'de',
      en_GB: 'en-GB',
      en_CA: 'en-CA',
      en_US: 'en-US',
      en_AU: 'en-au',
      es_ES: 'es-ES',
      fr_FR: 'fr-fr',
      fr_CA: 'fr-CA',
      it_IT: 'it',
      lt_LT: 'en-US',
      nl_NL: 'nl',
      pl_PL: 'pl',
      pt_PT: 'pt',
      sk_SK: 'sk',
      fi_FI: 'fi',
      cs_CZ: 'cs',
    };
    const translatorLang = this.$translate.use();
    if (languageCorrespondance[translatorLang]) {
      selectedLanguageCode = languageCorrespondance[translatorLang];
    }
    return selectedLanguageCode;
  }

  getIdentity() {
    return this.User.getUser();
  }

  static formatName(user) {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.name) {
      return user.name;
    }
    return '';
  }

  init() {
    if (window.zE) {
      this.getIdentity().then((identity) => {
        const name = this.constructor.formatName(identity);

        zE.setLocale(this.getLanguageCodeFromTranslator());
        zE.identify({
          name,
          email: identity.email,
        });
      });
    }
  }
}

angular
  .module('services')
  .service('zendesk', ['$translate', 'User', zendeskService]);
