/**
 * @ngdoc service
 * @name ngOvhJsplumb.jsPlumbService
 * @description
 *
 * Main service
 */
export default /* @ngInject */ function($q) {
  const initDeferred = $q.defer();

  /**
   * @ngdoc function
   * @name jsplumbInit
   * @methodOf ngOvhJsplumb.jsPlumbService
   * @description
   *
   * Initialize jsPlumb
   *
   */
  this.jsplumbInit = function jsplumbInit() {
    jsPlumb.ready(() => {
      initDeferred.resolve();
    });

    return initDeferred.promise;
  };

  /**
   * @ngdoc function
   * @name importDefaults
   * @methodOf ngOvhJsplumb.jsPlumbService
   * @description
   *
   * Configure jsPlumb
   *
   */
  this.importDefaults = function importDefaults(defaults) {
    jsPlumb.importDefaults(defaults);
  };
}
