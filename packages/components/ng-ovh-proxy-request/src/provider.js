export default function ovhProxyRequestProvider() {
  const self = this;
  let requestProxy = '$http';
  let pathPrefix = '/';

  this.pathPrefix = function pathPrefixFn(prefix) {
    if (prefix) {
      pathPrefix = prefix;
    }
    return pathPrefix;
  };

  this.proxy = function proxyFn(proxy) {
    if (proxy !== undefined) {
      requestProxy = proxy;
    }
    return requestProxy;
  };

  this.$get = /* @ngInject */ function $get($injector) {
    const proxy = $injector.get(self.proxy());
    proxy.pathPrefix = function pathPrefixFn(prefix) {
      return self.pathPrefix(prefix);
    };
    return proxy;
  };
}
