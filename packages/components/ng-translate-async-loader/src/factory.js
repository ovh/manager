// Inspired by angular-translate-partial-loader (see sources)
export default /* @ngInject */ ($q) => {
  /**
   * The tricky part of this loader is that we need to check
   * if an import (addTranslations) has been called during all
   * the pending imports. If it's the case we cannot return
   * translations yet, and we need to loop again in order to
   * wait for all the imports to be finised.
   */

  // loaded translations
  const translations = {};

  // list of pending translation import
  let pending = [];

  // list of pending translation import
  const translationGetters = [];

  // true when a new translation import occurs
  let changed = false;

  const loader = function loader() {
    // when the function is first called, we have no changes
    changed = false;

    // when all pending import are resolved
    return $q.all(pending).then(() => {
      // if an import has been added during pending changes we need to loop
      if (changed) {
        return loader();
        // otherwise it's fine we just return translations
      }
      return translations;
    });
  };

  loader.registerTranslationsRequest = function registerTranslationsRequest(
    fetchTranslationMethod,
  ) {
    const translationGetter = () =>
      fetchTranslationMethod().then((tr) => {
        Object.assign(translations, tr);
      });

    // we store the request trigger to be able to call it again when refreshing
    translationGetters.push(translationGetter);
    // a new import occurs, we keep trace of the change
    changed = true;

    const pendingImport = translationGetter();

    // push the pending import
    pending.push(pendingImport);

    return pendingImport;
  };

  loader.refreshTranslations = function addTranslations() {
    // To refresh the translations, we re-trigger the stored requests triggers
    pending = translationGetters.map((getter) => getter());
    return $q.all(pending);
  };

  return loader;
};
