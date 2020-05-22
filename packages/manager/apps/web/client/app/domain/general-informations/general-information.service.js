export default /* @ngInject */ function($http) {
  return {
    getDomainOptions(domainName) {
      return $http
        .get(`/domain/${domainName}/options`)
        .then(({ data: options }) => options);
    },
  };
}
