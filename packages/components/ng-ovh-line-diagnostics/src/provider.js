import angular from 'angular';
import forIn from 'lodash/forIn';
import merge from 'lodash/merge';

export default /* @ngInject */ function () {
  let requestProxy = '$http';
  let pollingApiOptions = null;
  let pathPrefix = '';

  this.setPathPrefix = function setPathPrefix(prefix) {
    if (prefix) {
      pathPrefix = prefix;
    }
    return pathPrefix;
  };

  this.setProxy = function setProxy(proxy) {
    if (proxy !== undefined) {
      requestProxy = proxy;
    }
    return requestProxy;
  };

  this.setpollingApiOptions = function setpollingApiOptions(apiOptions) {
    if (apiOptions !== undefined) {
      pollingApiOptions = apiOptions;
    }
    return pollingApiOptions;
  };

  this.$get = /* @ngInject */ function $get(
    $translatePartialLoader,
    $translate,
    OvhApiXdslDiagnosticLines,
  ) {
    const lineDiagnosticsService = {};

    lineDiagnosticsService.getRunDiagnostic = function getRunDiagnostic(uriParams, datas) {
      const syncParam = { faultType: 'unknown' };
      const postParams = datas && datas.faultType ? datas : angular.extend(syncParam, datas || {});

      if (postParams && postParams.answers) {
        forIn(postParams.answers, (attribut, key) => {
          if (attribut === 'true' || attribut === 'false') {
            postParams.answers[key] = postParams.answers[key] === 'true';
          }
        });
      }

      return OvhApiXdslDiagnosticLines.v6().runDiagnostic(merge(uriParams, postParams));
    };

    lineDiagnosticsService.getCancelDiagnostic = function getCancelDiagnostic(uriParams) {
      return OvhApiXdslDiagnosticLines.v6().cancelDiagnostic(uriParams, { });
    };

    lineDiagnosticsService.deletePollDiagnostic = function deletePollDiagnostic() {
      return OvhApiXdslDiagnosticLines.v6().killPollerDiagnostic();
    };

    return lineDiagnosticsService;
  };
}
