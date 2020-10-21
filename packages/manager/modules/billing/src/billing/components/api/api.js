export default /* @ngInject */ function BillingApiService($http, $q) {
  const self = this;

  this.operation = function operation(opt) {
    const requestUrl = URI.expand(opt.url, opt.urlParams || {})
      .search(opt.params || {})
      .toString();
    let requestBody;

    // Add body to the request (POST & PUT)
    if (opt.data) {
      requestBody = angular.toJson(opt.data);
    }

    return $http({
      method: opt.method,
      url: requestUrl,
      data: requestBody,
      cache: opt.cache || false,
    }).then(
      (response) => response.data,
      (response) => $q.reject(response),
    );
  };

  angular.forEach(['get', 'put', 'post', 'delete'], (operationType) => {
    self[operationType] = function operation(url, opt) {
      const options = angular.extend({}, opt);
      options.method = angular.uppercase(operationType);
      options.url = url;
      return self.operation(options);
    };
  });
}
