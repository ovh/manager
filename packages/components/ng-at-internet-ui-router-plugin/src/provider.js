/**
 * @ngdoc service
 * @require ng-at-internet, ui.router
 * @name atInternetUiRouterPluginProvider
 * @description
 * Provider allowing configuration for atInternetUiRouterPlugin.
 */
export default /* @ngInject */ function () {
  let stateTrackEnabled = false;
  const stateFilters = [];

  /**
   * @ngdoc function
   * @name atInternetUiRouterPluginProvider.setTrackStateChange
   * @methodOf atInternetUiRouterPluginProvider
   * @param {Boolean} state True to enable automatic state tracking, false otherwise.
   * @description
   * Enable or disable automatic state tracking (sends a page tracking data on each state change).
   */
  this.setTrackStateChange = function setTrackStateChange(state) {
    stateTrackEnabled = state;
  };

  /**
   * @ngdoc function
   * @name atInternetUiRouterPluginProvider.addStateFilter
   * @param {Function} callback Callback to apply to each state name before sending it.
   * @description
   * Apply the given callback function to each state name before sending it.
   * Example :
   * ```javascript
   * atInternetUiRouterPluginProvider.addStateNameFilter = function (stateName) {
   *     return stateName.replace("foo", "bar");
   * }
   * ```
   */
  this.addStateNameFilter = function addStateNameFilter(callback) {
    stateFilters.push(callback);
  };

  this.$get = /* @ngInject */ function $get() {
    return {
      /**
       * @ngdoc
       * @name isStateTrackEnabled
       * @methodOf atInternetUiRouterPlugin
       * @description returns True if automatic state traking is enabled, false otherwise.
       */
      isStateTrackEnabled() {
        return stateTrackEnabled;
      },

      /**
       * @ngdoc
       * @name getStateFilters
       * @methodOf atInternetUiRouterPlugin
       * @description returns the list of state name filers.
       */
      getStateFilters() {
        return stateFilters;
      },
    };
  };
}
