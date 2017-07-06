/**
 * @ngdoc service
 * @name ovh-angular-mondial-relay.service:mondialRelayProvider
 * @description
 * <p>Manage translation path</p>
 */
angular.module("ovh-angular-mondial-relay").provider("mondialRelay", function () {

    "use strict";

    var self = this;
    var translationPath = "../bower_components/ovh-angular-mondial-relay/dist/ovh-angular-mondial-relay";

    /*= ====================================
    =            CONFIGURATION            =
    =====================================*/

    /**
     * @ngdoc function
     * @methodOf ovh-angular-mondial-relay.service:mondialRelayProvider
     * @name setTranslationPath
     * @description Set path to the translation files
     * @param {String=} [path=undefined] Path the the translations or undefined to read the current path
     * @return {String} Current path
     */
    self.setTranslationPath = function (path) {
        if (path) {
            translationPath = path;
        }

        return translationPath;
    };

    /* -----  End of CONFIGURATION  ------*/

    /**
    * @ngdoc service
    * @name ovh-angular-mondial-relay.service:mondialRelay
    * @description
    * <p>Provide translation loader</p>
    */
    self.$get = function ($translate, $translatePartialLoader) {
        return {
            /**
             * @ngdoc function
             * @methodOf ovh-angular-mondial-relay.service:mondialRelay
             * @name addPart
             * @description Add loading part (refer to ngTranslate)
             * @param {String} translationPath Path the the translations
             */
            loadTranslations: function () {
                $translatePartialLoader.addPart(translationPath);
                return $translate.refresh();
            }
        };
    };

});
