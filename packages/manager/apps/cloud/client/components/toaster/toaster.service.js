/**
 * @ngdoc service
 * @name managerApp.service:Toaster
 * @description Manage Toast notifications
 */
angular
  .module('managerApp')
  .service('Toaster', function Toaster($translate, Toast) {
    /**
     * @ngdoc function
     * @methodOf managerApp.service:Toaster
     * @name success
     * @description Calls the Toast.success service
     * @param  {string} translationId     - Translation ID
     * @param  {object} translationParams - (Optional) Translation params
     * @return {function}                 - The Toast instance
     *
     * @example
     *   ```Toaster.success("translation_id", { param: "optional" });```
     */
    this.success = function success(translationId, translationParams) {
      return Toast.success(
        $translate.instant(translationId, translationParams),
      );
    };

    /**
     * @ngdoc function
     * @methodOf managerApp.service:Toaster
     * @name info
     * @description Calls the Toast.info service
     * @param  {string} translationId     - Translation ID
     * @param  {object} translationParams - (Optional) Translation params
     * @return {function}                 - The Toast instance
     *
     * @example
     *   ```Toaster.info("translation_id", { param: "optional" });```
     */
    this.info = function info(translationId, translationParams) {
      return Toast.info($translate.instant(translationId, translationParams));
    };

    /**
     * @ngdoc function
     * @methodOf managerApp.service:Toaster
     * @name error
     * @description Calls the Toast.error service
     * @param  {string|object} translationIdOrHttpError
     *                         Translation ID or HTTP error object
     * @param  {string|object} translationParamsOrTranslationId
     *                         (Optional) Translation params or Translation ID
     *                         (if 1st param is the HTTP error object)
     * @return {function}      The Toast instance
     *
     * @example
     * You have 2 possibilities:
     *   - A simple error message:
     *     ```Toaster.error("translation_id", { param: "optional" });```
     *   - An HTTP error message:
     *     ```Toaster.error(err, "custom_translation_id");```
     */
    this.error = function error(
      translationIdOrHttpError,
      translationParamsOrTranslationId,
    ) {
      if (angular.isString(translationIdOrHttpError)) {
        return Toast.error(
          $translate.instant(
            translationIdOrHttpError,
            translationParamsOrTranslationId,
          ),
        );
      }
      if (angular.isObject(translationIdOrHttpError)) {
        return Toast.error(
          [
            $translate.instant(
              translationParamsOrTranslationId || 'an_error_occurred',
            ),
            `<br/>[${translationIdOrHttpError.status}]`,
            (translationIdOrHttpError.data &&
              translationIdOrHttpError.data.message) ||
              translationIdOrHttpError.statusText ||
              '',
          ].join(' '),
        );
      }
      return null;
    };
  });
