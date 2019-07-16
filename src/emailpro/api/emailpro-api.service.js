angular
  .module('Module.emailpro.services')
  .service(
    'Api.EmailPro',
    function ApiEmailPro(WucApi, $q, constants, $cacheFactory, EmailPro) {
      const self = this;
      const cache = $cacheFactory('emailPro');

      function init() {
        angular.forEach(['get', 'put', 'post', 'delete'], (operationType) => {
          self[operationType] = function operationTypeFunction(a, bParam) {
            let b = bParam;
            if (!b) {
              b = {};
            }
            b.cache = cache;
            b.cache.removeAll();

            return EmailPro.gettingBaseAPIPath()
              .then(baseAPIPath => WucApi[operationType](`${constants.swsProxyRootPath}${baseAPIPath}${a}`, b))
              .then(data => data)
              .catch(reason => $q.reject(reason));
          };
        });
      }

      init();
    },
  );
