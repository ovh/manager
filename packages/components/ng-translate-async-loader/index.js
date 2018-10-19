// Inspired by angular-translate-partial-loader (see sources)
export default /* @ngInject */ function ($q) {
  /**
   * The tricky part of this loader is that we need to check
   * if an import (addTranslations) has been called during all
   * the pending imports. If it's the case we cannot return
   * translations yet and we need to loop again in order to
   * wait for all the imports to be finised.
   */

  // loaded translations
  const translations = {};

  // list of pending translation import
  const pending = [];

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

  loader.addTranslations = function addTranslations(translationPromise) {
    // a new import occurs, we keep trace of the change
    changed = true;

    // push the pending import
    pending.push(translationPromise.then((tr) => {
      Object.assign(translations, tr);
    }));
  };

  return loader;
}
