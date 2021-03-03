angular.module('services').service(
  'apiTranslator',
  class apiTranslator {
    /* @ngInject */
    constructor($translate) {
      this.$translate = $translate;
    }

    translate(apiResponse) {
      const { message } = apiResponse;
      const match = message && /^#([a-zA-Z0-9-_]+)\s/.exec(message);
      const id = match && match[1];
      const translationId = id && `common_api_${id}`;
      const translation =
        translationId && this.$translate.instant(translationId);
      return translation && translation !== translationId
        ? { message: translation }
        : apiResponse;
    }
  },
);
