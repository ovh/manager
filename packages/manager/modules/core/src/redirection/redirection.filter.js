export default /* @ngInject */ function(RedirectionService) {
  return function redirectionFilter(id, params) {
    return RedirectionService.getURL(id, params);
  };
}
