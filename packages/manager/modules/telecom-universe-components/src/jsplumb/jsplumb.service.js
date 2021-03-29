export default /* @ngInject */ function ($q, TUC_JS_PLUMB) {
  const self = this;

  const jsPlumbReadyDefered = $q.defer();

  self.initJsPlumb = function initJsPlumb() {
    TUC_JS_PLUMB.ready(() => {
      jsPlumbReadyDefered.resolve();
    });

    return jsPlumbReadyDefered.promise;
  };
}
