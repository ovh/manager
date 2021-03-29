import angular from 'angular';

export default /* @ngInject */ function ($http, $q) {
  const self = this;

  // DEPRECATED: You should use ovh.http
  this.operation = (opt) => {
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
    self[operationType] = (url, opt) => {
      const options = angular.extend({}, opt);
      options.method = operationType.toUpperCase();
      options.url = url;
      return self.operation(options);
    };
  });
}
