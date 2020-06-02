/**
 * @ngdoc service
 * @name actionsMenu.actionsMenuProvider
 *
 * @description
 * actionsMenuProvider allows developper to configure the path of the translation file.
 *
 * @example
 * <pre>
 *     angular.module("myManagerApp").config(function (actionsMenuProvider) {
 *          // set a new path for translations of the module
 *          actionsMenuProvider.setTranslationPath("/the/new/translation/path");
 *      });
 * </pre>
 */
export default function() {
  const self = this;
  let translationPath =
    '../bower_components/ovh-angular-actions-menu/dist/ovh-angular-actions-menu';

  /*= ====================================
    =            CONFIGURATION            =
    ===================================== */

  /**
   *  @ngdoc method
   *  @name actionsMenu.actionsMenuProvider#setTranslationPath
   *  @methodOf actionsMenu.actionsMenuProvider
   *
   *  @description
   *  Allows you to change the default location of the translation file of the module.
   *
   *  @param {String} path The new path of the translation file.
   *
   *  @return {String} The new configured translation path.
   */
  self.setTranslationPath = function(path) {
    if (path) {
      translationPath = path;
    }

    return translationPath;
  };

  /* -----  End of CONFIGURATION  ------*/

  /**
   *  @ngdoc service
   *  @name actionsMenu.service:actionsMenu
   *
   *  @description
   *  This service enable you to load translation file.
   */
  self.$get = /* @ngInject */ function(
    $translate /* , $translatePartialLoader */,
  ) {
    return {
      /**
       *  @ngdoc method
       *  @name actionsMenu.service:actionsMenu#
       *  @methodOf actionsMenu.service:actionsMenu
       *
       *  @description
       *  Load the translation file from the configured path.
       *
       *  @return {Promise} When the translation file is loaded.
       */
      loadTranslations() {
        // $translatePartialLoader.addPart(translationPath);
        return $translate.refresh();
      },
    };
  };
}
